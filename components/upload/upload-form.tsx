"use client";
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-action";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "file size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.error("error occurred while uploading", err);
      toast("Error occurred while uploading");
    },
    onUploadBegin: ({ file }) => {
      console.log("upload has begun for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission behavior (page refresh)
    console.log("submitted"); // Logs a message when the form is submitted
    const formData = new FormData(e.currentTarget); // Extracts the form data from the form element
    const file = formData.get("file") as File; // Retrieves the file uploaded, typed as 'File'

    //validating the file
    const validatedFields = schema.safeParse({ file });
    console.log(validatedFields);
    if (!validatedFields.success) {
      console.log(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid File"
      );
      toast("❌Something went wrong");
      return;
    }

    toast("📄Uploading PDF...");

    //Schema with zod
    //upload the file to uploadthing

    const resp = await startUpload([file]);
    if (!resp) {
      toast("Something went wrong! Please use a different file");
      return;
    }
    toast("Hang tight! Our AI is reading through yur document! ✨");
    //parse the pdf using lang chain
     const summary = await generatePdfSummary(resp);
     console.log({summary});
    //Summarize the pdf using AI
    //Save the summary to the database
    // redirect to the [id] summary page
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto ">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}

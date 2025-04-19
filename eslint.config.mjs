import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = {
  ...compat.config({
    extends: ['next/core-web-vitals','next/typescipt','prettier'],
    plugins: ['prettier'], //pretier will take care of your code if u make mistakes
    rules:{
      'prettier/prettier': 'error',
      'react/no-escape-entities':'off',
    },
  }),
};

export default eslintConfig;

import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import nextOnPages from "eslint-plugin-next-on-pages";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: { "next-on-pages": nextOnPages },
    rules: nextOnPages.configs["recommended"].rules,
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    ".vercel/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

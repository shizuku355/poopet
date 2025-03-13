import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 未使用の変数に関するエラーを警告レベルに下げる
      "@typescript-eslint/no-unused-vars": "warn",
      
      // React Hooksのルールに関する警告を無効化
      "react-hooks/rules-of-hooks": "off",
      
      // 依存配列の不足に関する警告を無効化
      "react-hooks/exhaustive-deps": "off",
      
      // imgタグの代わりにnext/imageを使用するよう促す警告を無効化
      "@next/next/no-img-element": "off"
    }
  }
];

export default eslintConfig;

import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import next from "@next/eslint-plugin-next";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/public/**",
      "**/.next/**",
      "**/.github/**",
      "**/tailwind.config.js",
      "**/postcss.config.js",
      "**/next.config.js",
      "**/next-env.d.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      react,
      next,
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off", // React import를 사용하지 않도록 설정

      "prettier/prettier": "warn", // Prettier 규칙을 ESLint에서 경고로 설정

      "@typescript-eslint/no-unused-vars": "off", // 사용하지 않는 변수 허용

      "@typescript-eslint/no-explicit-any": "off", // any 타입 사용 허용
      "@typescript-eslint/no-require-imports": "off", // require 사용 허용

      "react/no-unescaped-entities": "off", // React 컴포넌트에서 엔티티를 직접 사용하는 것을 허용
      "@typescript-eslint/no-non-null-assertion": "off", // non-null assertion 사용 허용
      "@next/next/no-page-custom-font": "off", // next.js에서 커스텀 폰트 사용을 허용
      "react/jsx-filename-extension": [
        1,
        {
          extensions: [".ts", ".tsx"],
        }, // ts파일에서 tsx 문법 사용 허용
      ],
    },
  },
  {
    extends: [tseslint.configs.disableTypeChecked],
  },
);

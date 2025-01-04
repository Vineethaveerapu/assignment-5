import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
    ignores: ["scripts/external-dependencies/"]
  },
  pluginJs.configs.recommended
];

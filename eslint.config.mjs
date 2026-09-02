// This is the configuration file for ESLint, the TypeScript linter:
// https://eslint.org/docs/latest/use/configure/

// @ts-check

import { completeConfigBase } from "eslint-config-complete";
import { isaacScriptModConfigBase } from "eslint-config-isaacscript";
import { defineConfig } from "eslint/config";

export default defineConfig(
  // https://github.com/complete-ts/complete/blob/main/packages/eslint-config-complete/src/base.js
  ...completeConfigBase,

  // https://github.com/IsaacScript/isaacscript/blob/main/packages/eslint-config-isaacscript/src/base.js
  ...isaacScriptModConfigBase,

  {
    rules: {
      // Insert changed or disabled rules here, if necessary.

      // @template-customization-start

      // All classes in this mod are internal only, so there is no need for method modifiers.
      "no-restricted-syntax": [
        "error",
        {
          message: 'Using "public" class method modifiers are not allowed.',
          selector: "MethodDefinition[accessibility='public']",
        },
        {
          message: 'Using "private" class method modifiers are not allowed.',
          selector: "MethodDefinition[accessibility='private']",
        },
        {
          message: 'Using "protected" class method modifiers are not allowed.',
          selector: "MethodDefinition[accessibility='protected']",
        },
      ],

      // TODO
      "complete/type-declaration-immutability": "off",
      "unicorn/no-declarations-before-early-exit": "off",
      "unicorn/no-immediate-mutation": "off",
      "unicorn/no-non-function-verb-prefix": "off",
      "unicorn/no-top-level-assignment-in-function": "off",
      "unicorn/no-top-level-side-effects": "off",
      "unicorn/no-useless-template-literals": "off",
      "unicorn/prefer-continue": "off",
      "unicorn/prefer-simple-condition-first": "off",

      // @template-customization-end
    },
  },
);

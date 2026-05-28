// @ts-check
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginQuery from "@tanstack/eslint-plugin-query";
import importPluginX from "eslint-plugin-import-x";

export default defineConfig([
    // Global Ignores
    globalIgnores([
        "dist",
        "eslint.config.js",
        "prettier.config.js",
        "commitlint.config.js",
        ".output/*",
        "*/components/ui/*",
        "src/routeTree.gen.ts",
    ]),

    // Modern TanStack Query Config Rules
    ...pluginQuery.configs["flat/recommended"],

    // Core TS, React, and Custom Rules
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        plugins: {
            import: importPluginX,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            // Your Custom Import Sorting Rules
            "import/no-cycle": "off",
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        ["parent", "sibling"],
                        "index",
                        "object",
                        "type",
                    ],
                    pathGroups: [
                        {
                            pattern: "react",
                            group: "external",
                            position: "before",
                        },
                    ],
                    pathGroupsExcludedImportTypes: ["react"],
                    "newlines-between": "always",
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],
            "sort-imports": "off",

            "react-refresh/only-export-components": "off", // Stops the TanStack Router RouteFile export errors
            "@tanstack/query/exhaustive-deps": "warn", // Downgrades useAuth queryKey array checks to a soft warning
            "react-hooks/set-state-in-effect": "warn", // Changes use-mobile.ts raw synchronous setState to a warning

            // TypeScript & Package overrides
            "@typescript-eslint/array-type": "off",
            "@typescript-eslint/require-await": "off",
            "pnpm/json-enforce-catalog": "off",

            // Warnings
            "no-undef": ["warn"],
        },
    },
]);

//  @ts-check

/** @type {import('prettier').Config} */
const config = {
    semi: true,
    singleQuote: false,
    tabWidth: 4,
    trailingComma: "es5",
    bracketSpacing: true,
    arrowParens: "avoid",

    plugins: ["prettier-plugin-tailwindcss"],
};

export default config;

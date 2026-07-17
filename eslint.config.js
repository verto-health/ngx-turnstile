// @ts-check
const { defineConfig } = require("eslint/config");
const angular = require("angular-eslint");

module.exports = defineConfig([
  // ngx-turnstile library
  {
    files: ["projects/ngx-turnstile/**/*.ts"],
    extends: [angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "ngx",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["projects/ngx-turnstile/**/*.html"],
    extends: [angular.configs.templateRecommended],
    rules: {},
  },
  // ngx-turnstile-demo application
  {
    files: ["projects/ngx-turnstile-demo/**/*.ts"],
    extends: [angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["projects/ngx-turnstile-demo/**/*.html"],
    extends: [angular.configs.templateRecommended],
    rules: {},
  },
]);

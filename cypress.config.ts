import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
  env: {
    baseUrl: 'http://0.0.0.0:4200',
    reactiveFormUrl: 'http://0.0.0.0:4200/reactive-form-example',
    templateDrivenFormUrl: 'http://0.0.0.0:4200/template-driven-form-example',
    languageOptionUrl: 'http://0.0.0.0:4200/language-option-example',
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

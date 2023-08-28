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
    baseUrl: 'http://localhost:4200',
    reactiveFormUrl: 'http://localhost:4200/reactive-form-example',
    templateDrivenFormUrl: 'http://localhost:4200/template-driven-form-example',
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

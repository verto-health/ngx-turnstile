import { defineConfig } from 'cypress';

export default defineConfig({
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

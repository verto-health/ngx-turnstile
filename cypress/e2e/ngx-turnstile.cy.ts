describe('tests the ngx-turnstile library', () => {
  // visits the Reactive Form Example route and makes sure the Successful DUMMY TOKEN is generated
  it('Passes Reactive Form Example', () => {
    cy.visit(Cypress.env('reactiveFormUrl'));
    cy.wait(3000);
    cy.contains('Value: XXXX.DUMMY.TOKEN.XXXX');
  });

  // visits the Template Driven Form Example route and makes sure the Successful DUMMY TOKEN is generated
  it('Passes Template Driven Form Example', () => {
    cy.visit(Cypress.env('templateDrivenFormUrl'));
    cy.wait(3000);
    cy.contains('Value: XXXX.DUMMY.TOKEN.XXXX');
  });
});

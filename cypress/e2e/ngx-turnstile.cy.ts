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

  // visits multiple routes and makes sure script is not injected multiple times
  it('Passes Visiting Multiple Routes Example', () => {
    cy.visit(Cypress.env('reactiveFormUrl'));
    cy.wait(3000);
    cy.contains('Value: XXXX.DUMMY.TOKEN.XXXX');

    cy.visit(Cypress.env('templateDrivenFormUrl'), {
      onBeforeLoad(win) {
        cy.spy(win.console, 'warn').as('consoleWarn');
      },
    });
    cy.wait(3000);
    cy.contains('Value: XXXX.DUMMY.TOKEN.XXXX');
    cy.get('@consoleWarn').should(
      'not.be.calledWith',
      '[Cloudflare Turnstile] Turnstile already has been loaded. Was Turnstile imported multiple times?.',
    );
  });
});

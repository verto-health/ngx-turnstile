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

  it('Passes Language Option Example', () => {
    cy.visit(Cypress.env('languageOptionUrl'));
    cy.wait(3000);
    cy.get('ngx-turnstile').should('have.attr', 'ng-reflect-language', 'FR');

    // checks the iframe src attribute to make sure the language option was sent to cloudflare correctly
    cy.get('ngx-turnstile div')
      .shadow()
      .find('iframe')
      .then(($iframe) => {
        cy.wrap($iframe).should('have.attr', 'src').and('include', 'FR');
      });
  });
});

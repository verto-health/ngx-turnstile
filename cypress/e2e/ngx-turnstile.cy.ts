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

  // the page mounts a normal widget and a conditional one together on load;
  // makes sure BOTH render (regression test for the callback-overwrite bug
  // where only the last-created widget rendered)
  it('Passes Multiple Widgets Example', () => {
    cy.visit(Cypress.env('multiWidgetUrl'));
    cy.wait(3000);
    cy.get('ngx-turnstile').should('have.length', 2);
    cy.get('ngx-turnstile').each(($widget) => {
      cy.wrap($widget).find('div').shadow().find('iframe').should('exist');
    });
  });

  // toggles the conditionally-rendered widget off then on (the repro from
  // issue #49) and makes sure it renders without the "reading 'render'" TypeError
  it('Passes Conditionally Rendered Widget Example', () => {
    const renderErrors: string[] = [];
    cy.on('uncaught:exception', (err) => {
      renderErrors.push(err.message);
      return false;
    });

    cy.visit(Cypress.env('multiWidgetUrl'), {
      onBeforeLoad(win) {
        cy.stub(win.console, 'error').callsFake((...args: unknown[]) => {
          renderErrors.push(args.map(String).join(' '));
        });
      },
    });
    cy.wait(3000);

    // Starts shown: normal widget + conditional widget.
    cy.get('ngx-turnstile').should('have.length', 2);

    // Unmount the conditional widget.
    cy.get('[data-cy="toggle-conditional-widget"]').uncheck();
    cy.get('ngx-turnstile').should('have.length', 1);

    // Re-mount it and make sure it renders again.
    cy.get('[data-cy="toggle-conditional-widget"]').check();
    cy.wait(2000);
    cy.get('ngx-turnstile').should('have.length', 2);
    cy.get('ngx-turnstile')
      .last()
      .find('div')
      .shadow()
      .find('iframe')
      .should('exist');

    cy.then(() => {
      const rendererrs = renderErrors.filter((e) => /reading 'render'/.test(e));
      expect(
        rendererrs,
        `no "reading 'render'" TypeError (issue #49)`,
      ).to.have.length(0);
    });
  });
});

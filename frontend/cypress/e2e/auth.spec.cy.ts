describe('AuthModule', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should redirect to auth page if not signed in', () => {
    cy.url().should('include', 'auth');
  });

  it('should have disabled register button', () => {
    cy.get('ion-text.toggle-auth-mode').click();
    cy.get('ion-button')
      .should('contain', 'Join')
      .should('have.attr', 'disabled');
  });

  it('should have disabled sign in button', () => {
    cy.get('ion-button')
      .should('contain', 'Sign in')
      .should('have.attr', 'disabled');
  });

  it('should register and toggle to login form', () => {
    cy.get('ion-text.toggle-auth-mode').click();
    cy.fixture('user').then((newUser) => {
      const { firstName, lastName, email, password } = newUser;
      cy.register(firstName, lastName, email, password);
      cy.get('ion-button').should('contain', 'Sign in');
    });
  });

  it('should login and go to /home', () => {
    cy.fixture('user').then((user) => {
      const { email, password } = user;
      cy.login(email, password);
      cy.get('ion-button').should('not.have.attr', 'disabled');
      cy.get('ion-button').click();
      cy.url().should('not.include', 'auth');
      cy.url().should('include', 'home');
    });
  });

  it('should logout and go to /auth login page', () => {
    cy.fixture('user').then((user) => {
      const { email, password } = user;
      cy.login(email, password);
    });
    cy.get('ion-col.popover-menu').click();
    cy.get('p.sign-out').click();

    cy.url().should('not.include', 'home');
    cy.url().should('include', 'auth');
  });
});

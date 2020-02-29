describe('Candidate Access', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('candidate_url'));
  });

  it('Users land on the signin page, and the cursor is set to the email address', () => {
    cy.focused().should('have.attr', 'id', 'username');
    cy.get(`div[class*='Login_logo']`)
      .should('have.css', 'background')
      .and('contain', 'logo');
    cy.get('.ant-typography')
      .should('contain.text', 'Powered by')
      .find('svg')
      .should('be.visible');
  });

  it('Users are able to successfully signin', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').should('be.visible');
  });

  it('Users are able to successfully signout', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Logout')
      .click();
    cy.get('.ant-avatar>.anticon-user').should('not.be.visible');
    cy.get('#username').should('be.visible');
  });

  it('Users are able to successfully signin again after signout', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Logout')
      .click();
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.get('.ant-avatar>.anticon-user').should('be.visible');
  });

  it('Signin button is disabled until both email and password fields are populated.', () => {
    cy.get('#username').type(Cypress.env('candidate_user'));
    cy.get('#username').clear();
    cy.get('#password').click();
    cy.get('button.ant-btn')
      .eq(0)
      .should('be.disabled');
    cy.get('#username').type(Cypress.env('candidate_user'));
    cy.get('#password').click();
    cy.get('button.ant-btn')
      .eq(0)
      .should('be.disabled');
    cy.get('#username').clear();
    cy.get('#password').type(Cypress.env('candidate_password'));
    cy.get('#username').click();
    cy.get('button.ant-btn')
      .eq(0)
      .should('be.disabled');
  });

  it('Error displays when user enters invalid email adress', () => {
    cy.get('#username').type('invalid');
    cy.get('#password').click();
    cy.get('.ant-form-explain').should('contain.text', 'Please enter a valid email!');
  });

  it(`If email/password combination is incorrect, the system will
      show an error message 'Email or password are invalid.`, () => {
    cy.loginCandidate('invalid@invalid.com', 'invalid');
    cy.get('.ant-form-explain').should('contain.text', `We can’t find that user, please try again.`);
  });

  it('Password field should work propery', () => {
    cy.get('#username').type(Cypress.env('candidate_user'));
    cy.get('#password').type(Cypress.env('candidate_password'));
    cy.get('#password').should('have.attr', 'type', 'password');
    cy.get('.ant-input-password-icon').click();
    cy.get('#password').should('have.attr', 'type', 'text');
  });
});

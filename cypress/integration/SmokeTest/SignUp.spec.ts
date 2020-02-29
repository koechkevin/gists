import { Chance } from 'chance';
const chance = Chance();

describe('Candidate Sign Up', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('candidate_url'));
    cy.get("a[href='/apply/auth/email']").click();
  });

  it('UI Validation', () => {
    cy.get("div[class*='FormContent_headerInfo']").should('contain.text', 'Have an Account ?Login');
    cy.get("div[class^='FormContent_logoSection']").should('be.visible');
    cy.contains('Start Application').should('be.visible');
    cy.contains('Enter your email to start your application').should('be.visible');
    cy.get('#username').should('be.visible');
    cy.get('.ant-btn').should('be.visible');
    cy.get('.ant-btn').should('be.disabled');
    cy.get('#username').type('invalid');
    cy.get("div[class^='FormContent_logoSection']").click();
    cy.get('.ant-form-explain').should('contain.text', 'The email address is invalid.');
    cy.get('.ant-btn').should('be.disabled');
  });

  it('Enter non registerd email', () => {
    cy.server();
    cy.route('PUT', '**/v1/users/register-candidate/resend-verification-message').as('resendCode');
    const newEmail =
      'testingemail' + chance.string({ length: 5, casing: 'upper', alpha: true, numeric: true }) + '@test.com';
    cy.get('#username').type(newEmail);
    cy.get('.ant-btn').click();
    cy.get('.ant-btn').should('be.disabled');
    cy.get('#firstname').type('testfirstname');
    cy.get('#firstname').clear();
    cy.get('#lastname').type('testlastname');
    cy.get('.ant-btn').should('be.disabled');
    cy.get('#firstname').type('testfirstname');
    cy.get('.ant-btn').click();
    cy.get("div[class*='FormContent_headerInfo']").should('contain.text', 'Have an Account ?Login');
    cy.get("div[class^='FormContent_logoSection']").should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get("span[class^='FormContent_validationContainer']").should('be.visible');
    cy.get('.ant-btn').should('be.visible');
    cy.get('.ant-btn').should('be.disabled');
    cy.get('#password').type('1234');
    cy.get('.ant-btn').should('be.disabled');
    cy.contains(' 1 numbers or special character')
      .parent()
      .should('have.attr', 'class')
      .and('contain', 'FormContent_activeIcon');
    cy.get('#password').clear();
    cy.get('#password').type('1234A');
    cy.get('.ant-btn').should('be.disabled');
    cy.contains('1 numbers or special character')
      .parent()
      .should('have.attr', 'class')
      .and('contain', 'FormContent_activeIcon');
    cy.contains('1 UPPERCASE')
      .parent()
      .should('have.attr', 'class')
      .and('contain', 'FormContent_activeIcon');
    cy.get('#password').clear();
    cy.get('#password').type('1234Aa');
    cy.get('.ant-btn').should('be.disabled');
    cy.contains('1 numbers or special character')
      .parent()
      .should('have.attr', 'class')
      .and('contain', 'FormContent_activeIcon');
    cy.contains('1 UPPERCASE')
      .parent()
      .should('have.attr', 'class')
      .and('contain', 'FormContent_activeIcon');
    cy.contains('1 lowercase character')
      .parent()
      .should('have.attr', 'class')
      .and('contain', 'FormContent_activeIcon');
    cy.get('#password').clear();
    cy.get('#password').type('1234Aaaa');
    cy.get('.ant-btn').should('be.enabled');
    cy.contains('1 numbers or special character')
      .parent()
      .should('have.attr', 'class')
      .and('contain', 'FormContent_activeIcon');
    cy.contains('1 UPPERCASE')
      .parent()
      .should('have.attr', 'class')
      .and('contain', 'FormContent_activeIcon');
    cy.contains('1 lowercase character')
      .parent()
      .should('have.attr', 'class')
      .and('contain', 'FormContent_activeIcon');
    cy.contains('Between 8 to 25 characters')
      .parent()
      .should('have.attr', 'class')
      .and('contain', 'FormContent_activeIcon');
    cy.get('#password').clear();
    cy.get('#password').type('Auror@20199999999999999998');
    cy.contains('Between 8 to 25 characters')
      .parent()
      .should('have.attr', 'class')
      .and('not.contain', 'FormContent_activeIcon');
    cy.get('.ant-btn').should('be.disabled');
    cy.get('#password').should('have.attr', 'type', 'password');
    cy.get('.ant-input-password-icon').click();
    cy.get('#password').should('have.attr', 'type', 'text');
    cy.get('#password').clear();
    cy.get('#password').type(Cypress.env('candidate_password'));
    cy.get('.ant-btn').click();
    cy.get("div[class*='FormContent_headerInfo']").should('contain.text', 'Have an Account ?Login');
    cy.get("div[class^='FormContent_logoSection']").should('be.visible');
    cy.get('#verificationCode').should('be.visible');
    cy.contains('Verify your email').should('be.visible');
    cy.contains("We've sent a code to " + newEmail).should('be.visible');
    cy.get('a')
      .contains("Didn't get the code")
      .should('be.visible');
    cy.get('.ant-btn').should('be.visible');
    cy.get('.ant-btn').should('be.disabled');
    cy.focused().should('have.attr', 'id', 'verificationCode');
    cy.get('#verificationCode').type('invalid');
    cy.get('.ant-btn').click();
    cy.get('.ant-form-explain').should('contain.text', 'The verification code is invalid.');
    cy.get('a')
      .contains("Didn't get the code")
      .click();
    cy.get('.ant-modal-title').should('contain.text', 'Resend a verification code');
    cy.get("[data-icon='times']").should('be.visible');
    cy.contains('We sent you a verification email at ' + newEmail + ' Please:').should('be.visible');
    cy.contains('1) Verify the email is correct.').should('be.visible');
    cy.contains('2) Check your SPAM folder.').should('be.visible');
    cy.get('.ant-modal-footer>button.ant-btn')
      .its('length')
      .should('eq', 2);
    cy.get('.ant-modal-footer>button.ant-btn')
      .contains('Resend')
      .parent()
      .should('be.visible');
    cy.get('.ant-modal-footer>button.ant-btn')
      .contains('Cancel')
      .parent()
      .should('be.visible');
    cy.get("[data-icon='times']").click();
    cy.get('.ant-modal-title').should('not.be.visible');
    cy.get('a')
      .contains("Didn't get the code")
      .click();
    cy.get('.ant-modal-footer>button.ant-btn')
      .contains('Resend')
      .parent()
      .click();
    cy.wait('@resendCode', { timeout: 60000 })
      .its('status')
      .should('equal', 204);
    cy.get('.ant-modal-title').should('not.be.visible');
  });

  it('Enter valid and registerd email', () => {
    cy.get('#username').type(Cypress.env('candidate_user'));
    cy.get('.ant-btn').should('be.enabled');
    cy.get('.ant-btn').click();
    cy.get("div[class*='FormContent_headerInfo']").should('contain.text', 'Have an Account ?Login');
    cy.get("div[class^='FormContent_logoSection']").should('be.visible');
    cy.contains('Welcome Back').should('be.visible');
    cy.contains('Seems you have an account already').should('be.visible');
    cy.contains(Cypress.env('candidate_user')).should('be.visible');
    cy.get('a')
      .contains("It's not me!")
      .should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#password').type(Cypress.env('candidate_password'));
    cy.get('#password').should('have.attr', 'type', 'password');
    cy.get('.ant-input-password-icon').click();
    cy.get('#password').should('have.attr', 'type', 'text');
    cy.get('a')
      .contains('Forgot your password?')
      .should('be.visible');
    cy.get('.ant-btn').should('be.visible');
    cy.get('a')
      .contains("It's not me!")
      .click();
    cy.contains('Start Application').should('be.visible');
  });

  it('Continue with registered email', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.get('#username').type(Cypress.env('candidate_user'));
    cy.get('.ant-btn').click();
    cy.get('#password').type(Cypress.env('candidate_password'));
    cy.get('.ant-btn').click();
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').should('be.visible');
  });
});

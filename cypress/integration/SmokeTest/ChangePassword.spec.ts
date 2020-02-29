describe('Change user password', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('candidate_url'));
  });

  it('Change Password popover ui validation', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Change Password')
      .click();
    cy.get('.ant-modal-title').should('contain.text', 'Change Password');
    cy.get('input#currentPassword').should('be.visible');
    cy.get('input#newPassword').should('be.visible');
    cy.get('input#confirmNewPassword').should('be.visible');
    cy.get('button>span').should('contain.text', 'Cancel');
    cy.get('button>span').should('contain.text', 'Change Password');
  });

  it('Dismiss Change Password popover', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Change Password')
      .click();
    cy.get('button')
      .contains('Cancel')
      .click({ force: true });
    cy.get('.ant-modal-mask')
      .contains('Change Password')
      .should('not.be.visible');
  });

  it('The "Change Password" button is disabled until all password fields are populated.', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Change Password')
      .click();
    cy.get('button.ant-btn-primary').should('be.disabled');
  });

  it('Enter invalid current password', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Change Password')
      .click();
    cy.get('input#currentPassword').type('invalid');
    cy.get('input#newPassword').type(Cypress.env('candidate_password'));
    cy.get('input#confirmNewPassword').type(Cypress.env('candidate_password'));
    cy.get('button')
      .contains('Change Password')
      .click({ force: true });
    cy.get('.ant-form-explain').should('contain.text', 'Oops! That’s not a match.');
  });

  it('Below 8 characters password on the New password and Confirm new password field', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Change Password')
      .click();
    cy.get('input#currentPassword').type(Cypress.env('candidate_password'));
    cy.get('input#newPassword').type('Auror@2');
    cy.get('input#confirmNewPassword').type('Auror@2');
    cy.get('button')
      .contains('Change Password')
      .click({ force: true });
    cy.get('.ant-form-explain').should(
      'contain.text',
      'New Password should have at least  8 characters, please try again.',
    );
  });

  it('Lowercase on the New password and Confirm new password field', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Change Password')
      .click();
    cy.get('input#currentPassword').type(Cypress.env('candidate_password'));
    cy.get('input#newPassword').type('auror@2019');
    cy.get('input#confirmNewPassword').type('auror@2019');
    cy.get('button')
      .contains('Change Password')
      .click({ force: true });
    cy.get('.ant-form-explain').should(
      'contain.text',
      'Password must contain at least: 1 lowercase char, 1 UPPERCASE char, 1 special char or number',
    );
  });

  it('Uppercase on the New password and Confirm new password field', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Change Password')
      .click();
    cy.get('input#currentPassword').type(Cypress.env('candidate_password'));
    cy.get('input#newPassword').type('AUROR@2019');
    cy.get('input#confirmNewPassword').type('AUROR@2019');
    cy.get('button')
      .contains('Change Password')
      .click({ force: true });
    cy.get('.ant-form-explain').should(
      'contain.text',
      'Password must contain at least: 1 lowercase char, 1 UPPERCASE char, 1 special char or number',
    );
  });

  it('None special case and number on the New password and Confirm new password field', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Change Password')
      .click();
    cy.get('input#currentPassword').type(Cypress.env('candidate_password'));
    cy.get('input#newPassword').type('Auroraaaaa');
    cy.get('input#confirmNewPassword').type('Auroraaaaa');
    cy.get('button')
      .contains('Change Password')
      .click({ force: true });
    cy.get('.ant-form-explain').should(
      'contain.text',
      'Password must contain at least: 1 lowercase char, 1 UPPERCASE char, 1 special char or number',
    );
  });

  it(`Mismatch greater than or equal 8 characters valid password on the New password
     and Confirm new password field`, () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Change Password')
      .click();
    cy.get('input#currentPassword').type(Cypress.env('candidate_password'));
    cy.get('input#newPassword').type('Auror@2019');
    cy.get('input#confirmNewPassword').type('Auror@2018');
    cy.get('button')
      .contains('Change Password')
      .click({ force: true });
    cy.get('.ant-form-explain').should('contain.text', 'Confirm New Password should be equal to "New Password".');
  });

  it('Max length 25 chars', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Change Password')
      .click();
    cy.get('input#currentPassword').type('Auror@20199999999999999998');
    cy.get('input#newPassword').type('Auror@20199999999999999998');
    cy.get('input#confirmNewPassword').type('Auror@20199999999999999998');
    cy.get('input#currentPassword').should('have.value', 'Auror@2019999999999999999');
    cy.get('input#newPassword').should('have.value', 'Auror@2019999999999999999');
    cy.get('input#confirmNewPassword').should('have.value', 'Auror@2019999999999999999');
  });

  it('Change password eye toggle', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Change Password')
      .click();
    cy.get('input#currentPassword').type(Cypress.env('candidate_password'));
    cy.get('input#newPassword').type(Cypress.env('company_2_admin_new_password'));
    cy.get('input#confirmNewPassword').type(Cypress.env('company_2_admin_new_password'));
    cy.get('input#currentPassword').should('have.attr', 'type', 'password');
    cy.get('input#currentPassword ~ span>.ant-input-password-icon').click();
    cy.get('input#currentPassword').should('have.attr', 'type', 'text');
    cy.get('input#newPassword').should('have.attr', 'type', 'password');
    cy.get('input#newPassword ~ span>.ant-input-password-icon').click();
    cy.get('input#newPassword').should('have.attr', 'type', 'text');
    cy.get('input#confirmNewPassword').should('have.attr', 'type', 'password');
    cy.get('input#confirmNewPassword ~ span>.ant-input-password-icon').click();
    cy.get('input#confirmNewPassword').should('have.attr', 'type', 'text');
  });
});

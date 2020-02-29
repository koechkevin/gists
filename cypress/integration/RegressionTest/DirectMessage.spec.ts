import { Chance } from 'chance';
const chance = Chance();

describe('Candidate Direct Message', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('company_url'));
  });

  it('Verify the candidates are able to edit their messages', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/*profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    cy.get(`div[class^='DirectMessageMenu']`).click();
    cy.get(`div[role='tab']`)
      .contains('Candidates')
      .click();
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);

    cy.get(`.ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5`)
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get(`div[class^='AddDirectMessage'] button.ant-btn`).click();
    cy.wait('@room', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    const randomAdminMessage = chance.guid();
    cy.get(`textarea[class^='MessageInput-module_message']`).type(randomAdminMessage);
    cy.get(`textarea[class^='MessageInput-module_message']`).type('{enter}');

    cy.visit(Cypress.env('candidate_url'));
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/jobs/**').as('job');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@job', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    cy.get(`div[title='Direct Messages'] ~ ul li.ant-menu-item div[class*='MenuItem-module_title']`)
      .contains(new RegExp('^' + Cypress.env('company_admin_name') + '$', 'g'))
      .click();
    cy.wait('@room', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    cy.contains(randomAdminMessage).click();
    cy.get('div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Edit Message')
      .should('not.be.visible');
    const randomMessage = chance.guid();
    cy.get(`textarea[class^='MessageInput-module_message']`).type(randomMessage);
    cy.get(`textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.contains(randomMessage).click();
    cy.get('div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Edit Message')
      .click();
    cy.get(`li[class*='ant-list-item MessageEditableItem'] .ant-avatar`).should('be.visible');
    cy.get(
      `li[class*='ant-list-item MessageEditableItem'] span[class*='MessageEditableItem-module_username']>strong`,
    ).should('be.visible');
    cy.get(`li[class*='ant-list-item MessageEditableItem'] span[class*='MessageEditableItem-module_timestamp']`).should(
      'be.visible',
    );
    cy.get(`li[class*='ant-list-item MessageEditableItem'] button`)
      .its('length')
      .should('be.equal', 2);
    cy.get(`li[class*='ant-list-item MessageEditableItem'] button`).should('contain.text', 'Cancel');
    cy.get(`li[class*='ant-list-item MessageEditableItem'] button`).should('contain.text', 'Save Changes');
    cy.get(`li.ant-list-item textarea[class^='MessageInput-module_message`).should('contain.text', randomMessage);
    cy.get(`li.ant-list-item textarea[class^='MessageInput-module_message`).clear();
    const newRandomMessage = chance.guid();
    cy.get(`li.ant-list-item textarea[class^='MessageInput-module_message`).type(newRandomMessage);
    cy.get(`li[class*='ant-list-item MessageEditableItem'] button`)
      .contains('Cancel')
      .click({ force: true });
    cy.contains(randomMessage).should('be.visible');
    cy.contains(newRandomMessage).should('not.be.visible');

    cy.contains(randomMessage).click();
    cy.get('div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Edit Message')
      .click();
    cy.get(`li.ant-list-item textarea[class^='MessageInput-module_message`).clear();
    cy.get(`li.ant-list-item textarea[class^='MessageInput-module_message`).type(newRandomMessage);
    cy.get(`li[class*='ant-list-item MessageEditableItem'] button`)
      .contains('Save Changes')
      .click({ force: true });
    cy.contains(randomMessage).should('not.be.visible');
    cy.contains(newRandomMessage + '(Edited)').should('be.visible');
  });
});

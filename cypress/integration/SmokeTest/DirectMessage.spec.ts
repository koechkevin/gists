import { Chance } from 'chance';
const chance = Chance();

describe('Candidate Direct Message', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('candidate_url'));
  });

  it('Verify the candidates may not initiate direct message with company users', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get(`div[class^='DirectMessageMenu']`).should('not.exist');
  });

  it('Verify the candidates are able to edit their messages', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/jobs/*').as('job');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('GET', '**/v1/threads/**').as('thread');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('POST', '**/v1/messages/**').as('message');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@job', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get(`.ant-layout div[class*='Header_titleContainer'] span[class^='Icon-module_icon']`).click();
    cy.get('span')
      .contains('Direct Messages')
      .click();
    cy.get(`ul li.ant-menu-item div[class*='MenuItem-module_title']`)
      .contains(new RegExp('^' + Cypress.env('company_admin_name') + '$', 'g'))
      .click();
    cy.wait('@botRoom', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get(`textarea[class^='MessageInput-module_message']`).type(randomMessage);
    cy.get(`textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.wait('@message', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.contains(randomMessage).click();
    cy.get('div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Edit Message')
      .click();
    cy.get(`li[class*='ant-list-item MessageEditableItem'] .ant-avatar`).should('be.visible');
    cy.get(`li[class*='ant-list-item MessageEditableItem'] span[class^='ant-typography']>strong`).should('be.visible');
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

  it('Verify the candidates are able to delete their messages', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/jobs/*').as('job');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('GET', '**/v1/threads/**').as('thread');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('POST', '**/v1/messages/**').as('message');
    cy.loginCandidate(Cypress.env('candidate_user'), Cypress.env('candidate_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@job', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get(`.ant-layout div[class*='Header_titleContainer'] span[class^='Icon-module_icon']`).click();
    cy.get('span')
      .contains('Direct Messages')
      .click();
    cy.get(`ul li.ant-menu-item div[class*='MenuItem-module_title']`)
      .contains(new RegExp('^' + Cypress.env('company_admin_name') + '$', 'g'))
      .click();
    cy.wait('@botRoom', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get(`textarea[class^='MessageInput-module_message']`).type(randomMessage);
    cy.get(`textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.wait('@message', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.contains(randomMessage).click();
    cy.get('div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Delete Message')
      .click();
    cy.get('.ant-btn-link').click();
    cy.get('.ant-btn-link').should('not.be.visible');
    cy.contains(randomMessage).should('be.visible');
    cy.contains(randomMessage).click();
    cy.get('div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Delete Message')
      .click();
    cy.get('.ant-btn-danger').click();
    cy.contains(randomMessage).should('not.be.visible');
  });
});

/// <reference path="../../support/index.d.ts" />
/// <reference types="Cypress" />

import { Chance } from 'chance';
const chance = Chance();

describe('Candidate user add/edit/delete a conversation', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('candidate_url'));
  });

  it('Add a Conversation Thread', () => {
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
    cy.get(`svg[data-icon='comment-lines']`).click();
    cy.wait('@thread', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    const threadMessage = chance.guid();
    const secondThreadMessage = chance.guid();
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type(threadMessage);
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type('{shift}{enter}');
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type(secondThreadMessage);
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.wait('@message', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.contains(threadMessage + '\n' + secondThreadMessage).should('be.visible');
  });

  it('Edit a Conversation Thread', () => {
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
    cy.get(`svg[data-icon='comment-lines']`).click();
    cy.wait('@thread', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    const threadMessage = chance.guid();
    const secondThreadMessage = chance.guid();
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type(threadMessage);
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.wait('@message', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.contains(threadMessage).click();
    cy.get('div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Edit Message')
      .click();
    cy.get("li.ant-list-item textarea[class^='MessageInput-module_message").clear();
    cy.get("li[class*='MessageEditableItem-module_editableItem'] textarea[class^='MessageInput-module_message']").type(
      secondThreadMessage,
    );
    cy.get("li[class*='MessageEditableItem-module_editableItem'] textarea[class^='MessageInput-module_message']").type(
      '{enter}',
    );
    cy.get("li[class*='ant-list-item MessageEditableItem'] button")
      .contains('Save Changes')
      .click({ force: true });
    cy.contains(secondThreadMessage).should('be.visible');
  });

  it('Delete a Conversation Thread', () => {
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
    cy.contains(randomMessage).click();
    cy.get(`svg[data-icon='comment-lines']`).click();
    cy.wait('@thread', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    const threadMessage = chance.guid();
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type(threadMessage);
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.wait('@message', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.contains(threadMessage).click();
    cy.get('div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Delete Message')
      .click();
    cy.get('.ant-btn-danger').click();
    cy.get("div[class*='Replies_header'] svg[data-icon='times']").click();
    cy.get('.ant-list-item')
      .contains(randomMessage)
      .parent()
      .parent()
      .parent()
      .siblings('.ant-list-item-meta-description')
      .should('not.be.visible');
  });
});

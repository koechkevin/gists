/// <reference types="Cypress" />

import { Chance } from 'chance';
const chance = Chance();

context('Candidate saves message as a draft', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('candidate_url'));
    cy.clearDraft();
  });

  it('The messages will be saved as draft status', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/jobs/*').as('job');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
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
    cy.get(`ul li.ant-menu-item div[class*='MenuItem-module_title']`)
      .contains(/^Hiring Bot$/)
      .click();
    cy.wait('@botRoom', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@roomPost', { timeout: 60000 })
      .its('status')
      .should('equal', 201);
    cy.get(`div[class^='ChannelMenu-module_titleContent']`)
      .contains('Draft')
      .parent()
      .siblings(`ul[class^='ChannelMenu-module_list']`)
      .get(`span[class^='ChannelMenu-module_name']`)
      .contains(Cypress.env('company_admin_name'))
      .should('be.exist');
    cy.get(`div[class^='ChannelMenu-module_titleContent']`)
      .contains('Draft')
      .parent()
      .siblings(`ul[class^='ChannelMenu-module_list']`)
      .get(`span[class^='ChannelMenu-module_name']`)
      .contains(Cypress.env('company_admin_name'))
      .click();
    cy.wait('@botRoom', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    cy.get(`textarea[class^='MessageInput-module_message']`).should('contain.text', randomMessage);
    cy.get(`textarea[class^='MessageInput-module_message']`).clear();
    cy.get(`ul li.ant-menu-item div[class*='MenuItem-module_title']`)
      .contains(/^Hiring Bot$/)
      .click();
    cy.wait('@botRoom', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get(`ul li.ant-menu-item div[class*='MenuItem-module_title']`)
      .contains(new RegExp('^' + Cypress.env('company_admin_name') + '$', 'g'))
      .should('be.exist');
  });

  it('Draft message for a thread', () => {
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
    const draftMessage = chance.guid();
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).type(draftMessage);
    cy.get(`div[class*='Replies_header'] svg[data-icon='times']`).dblclick();
    cy.wait('@roomPost', { timeout: 10000 })
      .its('status')
      .should('equal', 201);
    cy.contains(randomMessage).click();
    cy.get(`svg[data-icon='comment-lines']`).click();
    cy.wait('@thread', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).should(
      'contain.text',
      draftMessage,
    );
  });

  it('Draft message for multiple threads', () => {
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
    const secondRandomMessage = chance.guid();
    cy.get(`textarea[class^='MessageInput-module_message']`).type(secondRandomMessage);
    cy.get(`textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.wait('@message', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.contains(randomMessage).click();
    cy.get(`svg[data-icon='comment-lines']`).click();
    cy.wait('@thread', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    const draftMessage = chance.guid();
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).type(draftMessage);
    cy.get(`div[class*='Replies_header'] svg[data-icon='times']`).click();
    cy.wait('@roomPost', { timeout: 10000 })
      .its('status')
      .should('equal', 201);
    cy.contains(secondRandomMessage).click();
    cy.get(`svg[data-icon='comment-lines']`).click();
    cy.wait('@thread', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).should('contain.text', '');
    cy.get(`div[class*='Replies_header'] svg[data-icon='times']`).click();
    cy.contains(randomMessage).click();
    cy.get(`svg[data-icon='comment-lines']`).click();
    cy.wait('@thread', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).should(
      'contain.text',
      draftMessage,
    );
  });

  it('Draft message for a thread after logout and login', () => {
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
    const draftMessage = chance.guid();
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).type(draftMessage);
    cy.get(`div[class*='Replies_header'] svg[data-icon='times']`).click();
    cy.wait('@roomPost', { timeout: 10000 })
      .its('status')
      .should('equal', 201);

    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Logout')
      .click();
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
    cy.wait('@room', { timeout: 60000 })
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

    cy.contains(randomMessage).click();
    cy.get(`svg[data-icon='comment-lines']`).click();
    cy.wait('@thread', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).should(
      'contain.text',
      draftMessage,
    );
  });
});

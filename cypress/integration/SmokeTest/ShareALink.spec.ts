import { Chance } from 'chance';
const chance = Chance();

context('Candidate share a link', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('candidate_url'));
  });

  it('Share link with example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/jobs/**').as('job');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('roomNew');
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
    cy.wait('@roomNew', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get(`textarea[class^='MessageInput-module_message']`).type(randomMessage + ' example.com');
    cy.get(`textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.contains(randomMessage)
      .find('a')
      .should('contain.text', 'example.com')
      .should('have.attr', 'target', '_blank');
  });

  it('Share link with www.example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/jobs/**').as('job');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('roomNew');
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
    cy.wait('@roomNew', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get(`textarea[class^='MessageInput-module_message']`).type(randomMessage + ' www.example.com');
    cy.get(`textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.contains(randomMessage)
      .find('a')
      .should('contain.text', 'www.example.com')
      .should('have.attr', 'target', '_blank');
  });

  it('Share link with http://example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/jobs/**').as('job');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('roomNew');
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
    cy.wait('@roomNew', { timeout: 10000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get(`textarea[class^='MessageInput-module_message']`).type(randomMessage + ' http://example.com');
    cy.get(`textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.contains(randomMessage)
      .find('a')
      .should('contain.text', 'http://example.com')
      .should('have.attr', 'target', '_blank');
  });

  it('Share link in thread with example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/jobs/**').as('job');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('roomNew');
    cy.route('GET', '**/v1/threads/**').as('thread');
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
    cy.wait('@roomNew', { timeout: 10000 })
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
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).type(
      threadMessage + ' example.com',
    );
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.contains(threadMessage)
      .find('a')
      .should('contain.text', 'example.com')
      .should('have.attr', 'target', '_blank');
  });

  it('Share link in thread with www.example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/jobs/**').as('job');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('roomNew');
    cy.route('GET', '**/v1/threads/**').as('thread');
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
    cy.wait('@roomNew', { timeout: 10000 })
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
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).type(
      threadMessage + ' www.example.com',
    );
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.contains(threadMessage)
      .find('a')
      .should('contain.text', 'www.example.com')
      .should('have.attr', 'target', '_blank');
  });

  it('Share link in thread with http://example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/jobs/**').as('job');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('roomNew');
    cy.route('GET', '**/v1/threads/**').as('thread');
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
    cy.wait('@roomNew', { timeout: 10000 })
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
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).type(
      threadMessage + ' http://example.com',
    );
    cy.get(`div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.contains(threadMessage)
      .find('a')
      .should('contain.text', 'http://example.com')
      .should('have.attr', 'target', '_blank');
  });
});

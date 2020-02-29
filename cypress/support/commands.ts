Cypress.Commands.add('loginCompany', (email, password) => {
  cy.get('#username').type(email);
  cy.get('#password').type(password);
  cy.get('button.ant-btn-lg').click();
});

Cypress.Commands.add('loginCandidate', (email, password) => {
  cy.get('#username').type(email);
  cy.get('#password').type(password);
  cy.get('button.ant-btn>span')
    .contains('Login')
    .click({ force: true });
});

Cypress.Commands.add('clearDraft', () => {
  let token = '';
  let realToken = '';
  let roomID = '';
  let draftID = '';
  cy.request({
    method: 'POST',
    url: `${Cypress.env('aurora_api_url')}/auth/login`,
    body: {
      username: Cypress.env('candidate_user'),
      password: Cypress.env('candidate_password'),
    },
  }).then((response) => {
    token = response.body.token;
    cy.request({
      method: 'GET',
      url: `${Cypress.env('aurora_api_url')}/users/my-profiles`,
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }).then((res) => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('aurora_api_url')}/auth/select-profile`,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: {
          profile_id: res.body.items[0].profile_id,
        },
      }).then((selectProfileRes) => {
        realToken = selectProfileRes.body.token;
        cy.request({
          method: 'GET',
          url: `${Cypress.env('chat_api_url')}/drafts`,
          headers: {
            Authorization: 'Bearer ' + realToken,
          },
        }).then((draftRes) => {
          if (draftRes.body.items) {
            draftRes.body.items.forEach((element: any) => {
              roomID = element.room_id;
              draftID = element._id;
              cy.request({
                method: 'DELETE',
                url: `${Cypress.env('chat_api_url')}/rooms/${roomID}/drafts/${draftID}`,
                headers: {
                  Authorization: 'Bearer ' + realToken,
                },
              }).then((finalRes) => {
                // console.log(finalRes.body);
              });
            });
          }
        });
      });
    });
  });
});

Cypress.Commands.add('resetDefaultPassword', () => {
  let token = '';
  let realToken = '';
  let candidateProfileID: any = '';
  let companyProfileID: any = '';
  cy.request({
    method: 'POST',
    url: `${Cypress.env('aurora_api_url')}/auth/login`,
    body: {
      username: Cypress.env('aurora_admin'),
      password: Cypress.env('aurora_admin_password'),
    },
  }).then((response) => {
    token = response.body.token;
    cy.request({
      method: 'GET',
      url: `${Cypress.env('aurora_api_url')}/users/my-profiles`,
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }).then((res) => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('aurora_api_url')}/auth/select-profile`,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: {
          profile_id: res.body.items[1].profile_id,
        },
      }).then((selectProfileRes) => {
        realToken = selectProfileRes.body.token;
        cy.request({
          method: 'GET',
          url: `${Cypress.env('aurora_api_url')}/users/profiles`,
          headers: {
            Authorization: 'Bearer ' + realToken,
          },
        }).then((profilesRes) => {
          candidateProfileID = profilesRes.body.items.find(
            (profile: any) => profile.profile.email === Cypress.env('candidate_2_user'),
          );
          companyProfileID = profilesRes.body.items.find(
            (profile: any) => profile.profile.email === Cypress.env('company_2_admin') && profile.type === 'company',
          );
          cy.request({
            method: 'PUT',
            url: `${Cypress.env('aurora_api_url')}/users/candidate-profiles/${candidateProfileID.profile_id}`,
            headers: {
              Authorization: 'Bearer ' + realToken,
            },
            body: {
              new_password: Cypress.env('candidate_2_password'),
              confirm_new_password: Cypress.env('candidate_2_password'),
            },
          }).then((candidateRes) => {
            // console.log(candidateRes.body);
          });

          cy.request({
            method: 'PUT',
            url: `${Cypress.env('aurora_api_url')}/users/company-profiles/${companyProfileID.profile_id}`,
            headers: {
              Authorization: 'Bearer ' + realToken,
            },
            body: {
              new_password: Cypress.env('company_2_admin_password'),
              confirm_new_password: Cypress.env('company_2_admin_password'),
            },
          }).then((companyRes) => {
            // console.log(companyRes.body);
          });
        });
      });
    });
  });
});

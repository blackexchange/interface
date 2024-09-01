
import './commands'

Cypress.env('URL', 'http://localhost:3001');

before(() => {
    cy.loginApi('ig@ig.com','12345');

});
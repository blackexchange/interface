
import './commands'

Cypress.env('URL', 'http://localhost:3000');

before(() => {
    cy.loginApi('rodney1@ig.com','12345');

});
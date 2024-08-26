/// <reference types="cypress" />
describe('Teste Automatizado', () => {

    const url = Cypress.env('URL');

    it.only('Inserir Parceiro', () => {
        cy.request({
            method: "POST",
            url: `${url}/partners`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "name": "Rodney Neville Master",
                "phone":"7198888888",
                "email":"asd@iscom"
            }
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(201);
        });
    });

});

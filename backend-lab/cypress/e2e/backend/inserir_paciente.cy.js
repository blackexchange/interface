/// <reference types="cypress" />
describe('Teste Automatizado', () => {

    const url = Cypress.env('URL');

    it.only('Inserir novo Paciente', () => {
        cy.request({
            method: "POST",
            url: `${url}/patients`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "name": "Rodney",
                "dateOfBirth": "2012-10-01",
                "gender": "MALE"
            }
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(201);
        });
    });

});

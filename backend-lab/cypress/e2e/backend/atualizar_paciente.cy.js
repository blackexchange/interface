/// <reference types="cypress" />
describe('Teste Automatizado', () => {

    const url = Cypress.env('URL');

    it.only('Atualizar Paciente', () => {
        cy.request({
            method: "PUT",
            url: `${url}/patients/66cc8ebff09e7dffcaded6e1`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "name": "Rodney Neville Master",
                "dateOfBirth": "2012-10-01",
                "gender": "MALE",
                "phone":"7198888888",
                "email":"asd@iscom"
            }
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(200);
        });
    });

    it.only('Retornar paciente não encontrado', () => {
        cy.request({
            method: "PUT",
            failOnStatusCode: false,
            url: `${url}/patients/11cc88bff09e7dffcaded611`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "name": "Rodney BOMBA",
                "dateOfBirth": "2012-10-01",
                "gender": "MALE"
            }
        }).then((response) => {
            expect(response.status).to.equal(404);
        });
    });

});

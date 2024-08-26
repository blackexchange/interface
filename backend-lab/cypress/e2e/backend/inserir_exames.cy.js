/// <reference types="cypress" />
describe('Teste Automatizado', () => {

    const url = Cypress.env('URL');

    it.only('Inserir novo exame de paciente', () => {
        cy.request({
            method: "POST",
            url: `${url}/observations`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "patient": {"_id":"66ccdb1679288742d6dda965"},
                "interface":{"_id":"66ccdb0779288742d6dda961"},
                "barCode":"12312",
                "material":"serum",
                "tests":["TSS","TTG"],
                "status":'PENDENT',
                "urgent":false
            }
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(201);
        });
    });

});

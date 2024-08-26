/// <reference types="cypress" />
describe('Teste Automatizado', () => {

    const url = Cypress.env('URL');

    it.only('Atualizar exame', () => {
        cy.request({
            method: "PUT",
            url: `${url}/observations/66cc9c7ca3117b823e5c8f04`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "patient":"66cc8ebff09e7dffcaded6e1",
                "interface": "cobas",
                "material":"serum",
                "tests":["SOL"],
                "urgent":true
            }
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(200);
        });
    });

});

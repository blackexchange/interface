/// <reference types="cypress" />
describe('Teste Automatizado', () => {

    const url = Cypress.env('URL');

    it.only('Inserir novo exame', () => {
        cy.request({
            method: "POST",
            url: `${url}/exams`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "code": "ALB",
                "name": "Albumina",
                "area":"COAGULOGRAM",
                "material":"SERUM",
                "createdBy":"66d34e9bdabfa7de0207d722"
                
            }
            
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(201);
        });
    });
    it.only('Inserir novo exame 2', () => {
        cy.request({
            method: "POST",
            url: `${url}/exams`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "code": "HIV",
                "name": "AIDS",
                "area":"COAGULOGRAM",
                "material":"SERUM",
                "createdBy":"66d34e9bdabfa7de0207d722"
                
            }
            
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(201);
        });
    });

});

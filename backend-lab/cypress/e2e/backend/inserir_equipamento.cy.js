/// <reference types="cypress" />
describe('Teste Automatizado', () => {

    const url = Cypress.env('URL');

    it.only('Inserir equipamento', () => {
        cy.request({
            method: "POST",
            url: `${url}/interfaces`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "name": "CObas 4000",
                "code": "ssssss",
                "brand": "ALKK",
                "model":"AL",
                "area":"IMMUNOLOGY",
                "protocol":"HL7",
                "active":true,
                "testLevel":"1",
                "exams":[{
                    "name": "Colesterol",
                    "code": "COL",
                    "externalCode": "COL",
                    "material":  "serum",
                    "test":{
                        "code":"CO",
                        "externalCode": "CO"
                    },
                    "param":{
                        "code": "LAA",
                        "externalCode": "SDD"
                    },
                }],
            
            }
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(201);
        });
    });

});

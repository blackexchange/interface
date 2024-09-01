/// <reference types="cypress" />
describe('Teste Automatizado', () => {

    const url = Cypress.env('URL');

    it.only('Inserir equipamento 1', () => {
        cy.request({
            method: "POST",
            url: `${url}/interfaces`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "name": "Cobas 4000",
                "code": "COBA4",
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
                            "material":  "SERUM",
                            "test":{
                                "code":"COL",
                                "externalCode": "CO"
                            },
                        },
                        {
                            "name": "Tireoide",
                            "code": "TSH",
                            "externalCode": "TSH",
                            "material":  "SAN",
                            "test":{
                                "code":"TSH",
                                "externalCode": "TH1"
                            },
                        }
                ],
            
            }
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(201);
        });
    });

    it.only('Inserir equipamento 2', () => {
        cy.request({
            method: "POST",
            url: `${url}/interfaces`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "name": "Imullite 2000",
                "code": "IMUL",
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
                            "material":  "SERUM",
                            "test":{
                                "code":"COL",
                                "externalCode": "CO"
                            },
                        },
                        {
                            "name": "Tireoide",
                            "code": "TSH",
                            "externalCode": "TSH",
                            "material":  "SAN",
                            "test":{
                                "code":"TSH",
                                "externalCode": "TH1"
                            },
                        },
                        {
                            "name": "Albumina",
                            "code": "ALB",
                            "externalCode": "ALB",
                            "material":  "SAN",
                            "test":{
                                "code":"ALB",
                                "externalCode": "AL1"
                            },
                        }
                ],
            
            }
        }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(201);
        });
    });


});

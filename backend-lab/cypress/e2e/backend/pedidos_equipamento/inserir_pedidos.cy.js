/// <reference types="cypress" />
describe('Teste Automatizado', () => {

    const url = Cypress.env('URL');

    it.only('Inserir perido externo', () => {
        cy.request({
            method: "POST",
            url: `${url}/laborders`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "orders":[
                
                        {
                        "orderId":"1",
                        "patient": {
                            "name": "Rodney Neville Master",
                            "dateOfBirth": "2012-10-01",
                            "gender": "MALE",
                            "phone": "7198888888",
                            "email": "asd@iscom",
                            "document":"123123"
                        },
                        "orderItens":[
                            {   "itemId":"1",
                                "examCode":"TSH",
                                "codBar":"123234234",
                                "material": "SERUM",
                                "tests":[
                                    {
                                        "code": "TSH"
                                    }
                                ]
                            },
                            {
                                "itemId":"2",
                                "urgent":false,
                                "examCode":"ALB",
                                "codBar":"123234236",
                                "material": "SAN",
                                "tests":[
                                    {
                                        "code": "ALB"
                                    }
                                ]
                            }
                        ]
                        },
                        {
                            "orderId":"2",
                            "patient": {
                                "name": "Coca Master",
                                "dateOfBirth": "2012-10-01",
                                "gender": "MALE",
                                "phone": "7198888888",
                                "email": "asd@iscom",
                                "document":"123123"
                            },
                            "orderItens":[
                                {   "itemId":"1",
                                    "examCode":"TSH",
                                    "codBar":"1113333",
                                    "material": "SERUM",
                                    "tests":[
                                        {
                                            "code": "TSH"
                                        }
                                    ]
                                },
                                {
                                    "itemId":"2",
                                    "urgent":false,
                                    "examCode":"ALB",
                                    "codBar":"5553333",
                                    "material": "SAN",
                                    "tests":[
                                        {
                                            "code": "ALB"
                                        }
                                    ]
                                },
                                {
                                    "itemId":"3",
                                    "urgent":false,
                                    "examCode":"CAL",
                                    "codBar":"5553333",
                                    "material": "SAN",
                                    "tests":[
                                        {
                                            "code": "CAL"
                                        }
                                    ]
                                }
                            ]
                        
                        }
                    ]
                }
             }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(201);
        });
    });


});

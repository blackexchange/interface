/// <reference types="cypress" />
describe('Teste Automatizado', () => {

    const url = Cypress.env('URL');

    it('Inserindo resultado', () => {
        cy.request({
            method: "PUT",
            url: `${url}/observations/66cc9c7ca3117b823e5c8f04/results`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "results": [
                                {
                                    "test": "SOL",
                                    "param": "ass",
                                    "value": "1232",
                                    "flags":["HI","LO"]
                                }
                            ]
                }
            }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(200);
        });
    });

    it('Inserinto mais resultado ao mesmo pedido', () => {
        cy.request({
            method: "PUT",
            url: `${url}/observations/66cc9c7ca3117b823e5c8f04/results`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "patient":"66cc8ebff09e7dffcaded6e1",
                "results": [
                                {
                                    "test": "HEMO",
                                    "results": [
                                                    {
                                                    "parameter": "Hemoglobina",
                                                    "value": "13.5",
                                                    "unit": "g/dL",
                                                    "referenceRange": "13.0 - 17.0"
                                                    },
                                                    {
                                                    "parameter": "Hematócrito",
                                                    "value": "40.2",
                                                    "unit": "%",
                                                    "referenceRange": "38.0 - 50.0"
                                                    },
                                                    {
                                                    "parameter": "Eritrócitos",
                                                    "value": "4.7",
                                                    "unit": "milhões/mm³",
                                                    "referenceRange": "4.5 - 5.9"
                                                    },
                                                    {
                                                    "parameter": "Leucócitos",
                                                    "value": "7.8",
                                                    "unit": "mil/mm³",
                                                    "referenceRange": "4.0 - 11.0"
                                                    },
                                                    {
                                                    "parameter": "Plaquetas",
                                                    "value": "250",
                                                    "unit": "mil/mm³",
                                                    "referenceRange": "150 - 400"
                                                    },
                                                    {
                                                    "parameter": "Volume Corpuscular Médio (VCM)",
                                                    "value": "85",
                                                    "unit": "fL",
                                                    "referenceRange": "80 - 100"
                                                    },
                                                    {
                                                    "parameter": "Hemoglobina Corpuscular Média (HCM)",
                                                    "value": "29",
                                                    "unit": "pg",
                                                    "referenceRange": "26 - 34"
                                                    },
                                                    {
                                                    "parameter": "Concentração de Hemoglobina Corpuscular Média (CHCM)",
                                                    "value": "34",
                                                    "unit": "g/dL",
                                                    "referenceRange": "32 - 36"
                                                    },
                                                    {
                                                    "parameter": "RDW",
                                                    "value": "13.5",
                                                    "unit": "%",
                                                    "referenceRange": "11.5 - 14.5"
                                                    }
                                                ]

                                },
                                {
                                    "test": "PET",
                                    "results":[{
                                        "test": "PET",
                                        "param": "LL",
                                        "value": "23424"
                                        }
                                    ],
                                },
                                {
                                    "test": "OLHO",
                                    "param": "LL",
                                    "value": "23424"
                                }
                            ]
                }
            }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(200);
        });
    });

    
    it('Inserindo HEMOGRAMA', () => {
        cy.request({
            method: "PUT",
            url: `${url}/observations/66cc9c7ca3117b823e5c8f04/results`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "patient":"66cc8ebff09e7dffcaded6e1",
                results: [
                    {
                        test: "Hemograma Completo",
                        param: "",
                        value: "",
                        unit: "",
                        flags: [],
                        referenceRange: "",
                        text: "",
                        additionalData: {
                            material: "Sangue",
                            method: "Automação"
                        },
                        results: [
                            {
                                test: "Eritrograma",
                                param: "",
                                value: "",
                                unit: "",
                                flags: [],
                                referenceRange: "",
                                text: "",
                                additionalData: null,
                                results: [
                                    {
                                        test: "Eritrócitos",
                                        param: "Eritrócitos",
                                        value: "4.47",
                                        unit: "milhões/mm³",
                                        flags: [],
                                        referenceRange: "4.00 - 5.20",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Hemoglobina",
                                        param: "Hemoglobina",
                                        value: "14.7",
                                        unit: "g/dL",
                                        flags: [],
                                        referenceRange: "11.7 - 15.7",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Hematócrito",
                                        param: "Hematócrito",
                                        value: "41.6",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "36.0 - 46.0",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "VCM",
                                        param: "Volume Corpuscular Médio (VCM)",
                                        value: "93.06",
                                        unit: "fL",
                                        flags: [],
                                        referenceRange: "81.0 - 101.0",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "HCM",
                                        param: "Hemoglobina Corpuscular Média (HCM)",
                                        value: "32.39",
                                        unit: "pg",
                                        flags: ["H"],
                                        referenceRange: "27.0 - 31.0",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "CHCM",
                                        param: "Concentração de Hemoglobina Corpuscular Média (CHCM)",
                                        value: "35.34",
                                        unit: "g/dL",
                                        flags: [],
                                        referenceRange: "32.0 - 36.0",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "RDW",
                                        param: "RDW",
                                        value: "13.4",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "12.0 - 17.0",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    }
                                ]
                            },
                            {
                                test: "Leucograma",
                                param: "",
                                value: "",
                                unit: "",
                                flags: [],
                                referenceRange: "",
                                text: "",
                                additionalData: null,
                                results: [
                                    {
                                        test: "Leucócitos",
                                        param: "Leucócitos",
                                        value: "5750",
                                        unit: "/mm³",
                                        flags: [],
                                        referenceRange: "4000 - 11000",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Basófilos",
                                        param: "Basófilos",
                                        value: "1",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "0 - 1",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Eosinófilos",
                                        param: "Eosinófilos",
                                        value: "1",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "0 - 5",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Mielócitos",
                                        param: "Mielócitos",
                                        value: "0",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "0",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Metamielócitos",
                                        param: "Metamielócitos",
                                        value: "0",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "0",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Bastões",
                                        param: "Bastões",
                                        value: "0",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "0 - 7",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Segmentados",
                                        param: "Segmentados",
                                        value: "66",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "35 - 70",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Linfócitos",
                                        param: "Linfócitos",
                                        value: "26",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "15 - 45",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Linfócitos atípicos",
                                        param: "Linfócitos atípicos",
                                        value: "0",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "0",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Monócitos",
                                        param: "Monócitos",
                                        value: "6",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "0 - 10",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    }
                                ]
                            },
                            {
                                test: "Plaquetas",
                                param: "",
                                value: "",
                                unit: "",
                                flags: [],
                                referenceRange: "",
                                text: "",
                                additionalData: null,
                                results: [
                                    {
                                        test: "Plaquetas",
                                        param: "Plaquetas",
                                        value: "182",
                                        unit: "mil/mm³",
                                        flags: [],
                                        referenceRange: "150 - 450",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "VPM",
                                        param: "Volume Plaquetário Médio (VPM)",
                                        value: "8.72",
                                        unit: "fL",
                                        flags: [],
                                        referenceRange: "7.5 - 9.5",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "Plaquetócrito",
                                        param: "Plaquetócrito",
                                        value: "0.146",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "0.10 - 0.28",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    },
                                    {
                                        test: "PDW",
                                        param: "PDW",
                                        value: "17.20",
                                        unit: "%",
                                        flags: [],
                                        referenceRange: "16.30 - 17.90",
                                        text: "",
                                        additionalData: null,
                                        results: []
                                    }
                                ]
                            }
                        ],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]
                
                }
            }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(200);
        });
    });


    
    it('Inserindo exames de BIOQUÍMICA', () => {
        cy.request({
            method: "PUT",
            url: `${url}/observations/66cc9c7ca3117b823e5c8f04/results`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "patient":"66cc8ebff09e7dffcaded6e1",
                results: [
                    
                        {
                            test: "Glicose",
                            param: "Glicose",
                            value: "95",
                            unit: "mg/dL",
                            flags: [],
                            referenceRange: "70 - 99",
                            text: "Nível de glicose no sangue dentro da faixa normal.",
                            additionalData: null,
                            results: []
                        }  ,{
                            test: "Creatinina",
                            param: "Creatinina",
                            value: "1.1",
                            unit: "mg/dL",
                            flags: [],
                            referenceRange: "0.6 - 1.2",
                            text: "Nível de creatinina no sangue dentro da faixa normal.",
                            additionalData: null,
                            results: []
                        },
                        {
                            test: "Colesterol Total",
                            param: "Colesterol Total",
                            value: "180",
                            unit: "mg/dL",
                            flags: [],
                            referenceRange: "< 200",
                            text: "Nível de colesterol total dentro da faixa desejável.",
                            additionalData: null,
                            results: []
                        },
                        {
                            test: "HDL",
                            param: "Colesterol HDL",
                            value: "55",
                            unit: "mg/dL",
                            flags: [],
                            referenceRange: "> 40",
                            text: "Nível de HDL dentro da faixa ideal.",
                            additionalData: null,
                            results: []
                        },
                        {
                            test: "LDL",
                            param: "Colesterol LDL",
                            value: "110",
                            unit: "mg/dL",
                            flags: [],
                            referenceRange: "< 130",
                            text: "Nível de LDL dentro da faixa desejável.",
                            additionalData: null,
                            results: []
                        },
                        {
                            test: "Triglicerídeos",
                            param: "Triglicerídeos",
                            value: "150",
                            unit: "mg/dL",
                            flags: [],
                            referenceRange: "< 150",
                            text: "Nível de triglicerídeos no limite superior da faixa normal.",
                            additionalData: null,
                            results: []
                        },
                        {
                            test: "ALT (TGP)",
                            param: "ALT (TGP)",
                            value: "35",
                            unit: "U/L",
                            flags: [],
                            referenceRange: "10 - 40",
                            text: "Nível de ALT dentro da faixa normal.",
                            additionalData: null,
                            results: []
                        },
                        {
                            test: "AST (TGO)",
                            param: "AST (TGO)",
                            value: "30",
                            unit: "U/L",
                            flags: [],
                            referenceRange: "10 - 40",
                            text: "Nível de AST dentro da faixa normal.",
                            additionalData: null,
                            results: []
                        },
                        {
                            test: "Fosfatase Alcalina",
                            param: "Fosfatase Alcalina",
                            value: "100",
                            unit: "U/L",
                            flags: [],
                            referenceRange: "30 - 120",
                            text: "Nível de fosfatase alcalina dentro da faixa normal.",
                            additionalData: null,
                            results: []
                        },
                        {
                            test: "Bilirrubina Total",
                            param: "Bilirrubina Total",
                            value: "0.8",
                            unit: "mg/dL",
                            flags: [],
                            referenceRange: "0.1 - 1.2",
                            text: "Nível de bilirrubina total dentro da faixa normal.",
                            additionalData: null,
                            results: []
                        }
                              
                        ],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                
                
                
                
            }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(200);
        });
    });

    
    it.only('Inserindo exames de COAGULOOGRAMA', () => {
        cy.request({
            method: "PUT",
            url: `${url}/observations/66cc9c7ca3117b823e5c8f04/results`,
            headers: {'Authorization':Cypress.env('TOKEN')},
            body: {
                "patient":"66cc8ebff09e7dffcaded6e1",
                results: [
                    {
                        test: "Coagulation Profile",
                        param: "",
                        value: "",
                        unit: "",
                        flags: [],
                        referenceRange: "",
                        text: "",
                        additionalData: {
                            material: "Plasma",
                            method: "Automated"
                        },
                        results: [
                            {
                                test: "Prothrombin Time (PT)",
                                param: "Prothrombin Time",
                                value: "12.5",
                                unit: "seconds",
                                flags: [],
                                referenceRange: "10.0 - 14.0",
                                text: "Prothrombin Time within the normal range.",
                                additionalData: null,
                                results: [
                                    {
                                        test: "INR",
                                        param: "INR",
                                        value: "1.1",
                                        unit: "",
                                        flags: [],
                                        referenceRange: "0.8 - 1.2",
                                        text: "INR within the normal range.",
                                        additionalData: null,
                                        results: []
                                    }
                                ]
                            },
                            {
                                test: "Activated Partial Thromboplastin Time (aPTT)",
                                param: "Activated Partial Thromboplastin Time",
                                value: "30.0",
                                unit: "seconds",
                                flags: [],
                                referenceRange: "25.0 - 35.0",
                                text: "aPTT within the normal range.",
                                additionalData: null,
                                results: []
                            },
                            {
                                test: "Fibrinogen",
                                param: "Fibrinogen",
                                value: "300",
                                unit: "mg/dL",
                                flags: [],
                                referenceRange: "200 - 400",
                                text: "Fibrinogen level within the normal range.",
                                additionalData: null,
                                results: []
                            }
                        ],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]
            }
                
                
            }).then((response) => {
            cy.log(response.body);
            expect(response.status).to.equal(200);
        });
    });

});

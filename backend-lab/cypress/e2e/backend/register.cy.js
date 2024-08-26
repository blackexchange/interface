/// <reference types="cypress" />
describe('Teste Automatizado: API Contratante', () => {

    const url =  Cypress.env('URL');
         
    it('Registrar Usuário' , () => {
       
       return cy.request({
         
           method: "POST",
           url:  `${url}/register`,
           body: {
             "name":"Rodney",
             "email": "maza@ig.com",
             "password":"12345"
          }
            
       }).then((response) => {
          cy.log(response.body)
           expect(response.status).to.equal(201);
           
       });
    });

    it('Usuário já registrado' , () => {
       
      return cy.request({
        
          method: "POST",
          url:  `${url}/register`,
          body: {
            "name":"Rodney",
            "email": "rodney1@ig.com",
            "password":"12345"
         }
           
      }).then((response) => {
         cy.log(response.body)
          expect(response.status).to.equal(404);
          
      });
   });
});
 
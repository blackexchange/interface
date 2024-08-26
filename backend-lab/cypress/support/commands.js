Cypress.Commands.add('loginApi', (email, password) => {
    cy.request({
        method: 'POST',
        url: Cypress.env('URL')+'/login',
        headers:{"Content-Type":"application/json"},
        body: {
            email,
            password
         }
    }).then((response) => {
        expect(response.body).to.have.property('token'); // Assumindo que a resposta inclui um token
        Cypress.env('TOKEN', response.body.token);
    });
});

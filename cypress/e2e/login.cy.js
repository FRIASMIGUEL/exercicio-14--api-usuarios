/// <reference types="cypress"/>

describe('Login - testes da API serverest ', () => {
    
    it.only('Deve fazer login com sucesso', () => {
        
    cy.request({
    method: 'Post',
    url: 'http://localhost:3000/login',
    
    body: { "email": "fulano@qa.com", 
    password: "teste"
    }
    
    }) .then((response) => {  
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Login realizado com sucesso')
        cy.log(response.body.authorization)
     })
    


    });
    
})

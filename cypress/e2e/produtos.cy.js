/// <reference types="cypress"/>
import contrato from '../contracts/produtos.contract'

describe('testes da funcinalidade produtos', () => {

let token      
before(() => {
      cy.token('fulano@qa.com','teste').then(tkn => { token = tkn})
});

it('Deve validar contrato de produtos com sucesso', () => {
     
      cy.request('produtos').then( response => {
       return contrato.validateAsync(response.body)
})

});
    it('Listar produtos', () => {
          cy.request({
    method: 'Get',
    url: 'produtos',
    
          }).then((response) =>{
                    
           // expect(response.body.produtos[9].nome).to.equal('Produto EBAC 25960629') //   
            
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(100)
          })
    });

    it('Cadastrar produto', () => {
      let produto = `produto EBAC ${Math.floor(Math.random() * 100000000 )}`
      cy.request({
method: 'POST',
url: 'produtos',
body:{        
"nome": produto,
"preco": 100,
"descricao": "Produto novo",
"quantidade": 200
},

headers:{authorization: token
}


})
      
      .then((response) => {

            expect(response.status).to.equal(201)
            expect(response.body.message).to.have.equal('Cadastro realizado com sucesso')

      })

})

it('Deve gerar mensagem de erro ao cadastrar produto repetido', () => {

    
   cy.cadastrarproduto(token, 'Produto EBAC Novo 1', 250, 'Descrição do produto novo ', 180)   
  
         
  .then((response) => {
  
      expect(response.status).to.equal(400)
      expect(response.body.message).to.have.equal('Já existe produto com esse nome')

}) 

})
it('Deve editar um produto já cadastrado', () => {
      cy.request('produtos').then(response => {
          let id = response.body.produtos[0]._id
          cy.request({
              method: 'PUT', 
              url: `produtos/${id}`,
              headers: {authorization: token},
              
              body: 
              {
                  "nome": "Produto Editado 45642083",
                  "preco": 200,
                  "descricao": "Produto editado",
                  "quantidade": 330
                }
                
          }).then(response => {
              expect(response.body.message).to.equal('Registro alterado com sucesso')

          })
      })
  });

     


it('Deve editar um produto cadastrado previamente', () => {
 let produto = `produto EBAC ${Math.floor(Math.random() * 100000000 )}`
cy.cadastrarproduto(token, produto, 250, " Descrição do produto novo ", 180)
.then(response => {
let id = response.body._id

cy.request({
      method: 'PUT',
      url: `produtos/${id}`,
      headers: {authorization: token},
      body:{        
      "nome": produto,
      "preco": 200,
      "descricao": "Produto editado",
      "quantidade": 300
      },

})
.then((response) => {
  
      expect(response.body.message).to.have.equal('Registro alterado com sucesso')

})

})
}) 

it('Deve deletar um produto previamente cadastrado', ()  => {
      let produto = `produto EBAC ${Math.floor(Math.random() * 100000000 )}`
      cy.cadastrarproduto(token, produto, 250, " Descrição do produto novo ", 180)
      .then(response => {
      let id = response.body._id
cy.request({
      method: 'DELETE',
      url: `produtos/${id}`,
      headers: {authorization: token},
})
.then((response) => {
  
      expect(response.body.message).to.have.equal('Registro excluído com sucesso')
      expect(response.status).to.equal(200)

})
})

})})


/// <reference types="cypress" />

import { faker } from '@faker-js/faker'

import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
    let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    })

    it('Deve validar contrato de usuários', () => {

        cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
        })
    })

    it('Deve listar usuários cadastrados', () => {

        cy.request({
            method: 'GET',
            url: 'usuarios',

        }).then((response) => {
            // expect(response.body.usuarios[0].nome).to.equal('Fulano da Silva')
            expect(response.status).to.equal(200);
        })
    });

    it('Deve cadastrar um usuário com sucesso', () => {

        let nome = faker.internet.userName()
        let email = faker.internet.email()
        let senha = faker.internet.password()

        cy.cadastrarusuario(nome, email, senha)

            .then(response => {
                expect(response.status).to.equal(201)
                expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            })
    })

    it('Deve validar um usuário com email inválido', () => {

        cy.cadastrarusuario("Abrantes", "amq@a.com", "senha")

            .then(response => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Este email já está sendo usado')
            })
    })

    it('Deve editar um usuário previamente cadastrado', () => {

        let nome = faker.internet.userName()
        let email = faker.internet.email()
        let senha = faker.internet.password()

        cy.cadastrarusuario(nome, email, senha)

            .then(response => {
                let id = response.body._id

                cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body: {
                        "nome": 'nome alterado',
                        "email": email,
                        "password": senha,
                        "administrador": "true",
                    }
                })
                    .then((response) => {
                        expect(response.status).to.equal(200)
                        expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
            })
    })

    it('Deve deletar um usuário previamente cadastrado', () => {

        let nome = faker.internet.userName()
        let email = faker.internet.email()
        let senha = faker.internet.password()

        cy.cadastrarusuario(nome, email, senha)

            .then(response => {
                let id = response.body._id

                cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                }
                )
            })
            .then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.have.equal('Registro excluído com sucesso')
            })
    })
})




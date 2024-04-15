import { beforeAll, afterAll, describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import { execSync } from "node:child_process";

/**
 * execSync é um método utilizado para executar comandos de terminal no Node.js
 * EX: execSync('node --watch file.js'); 
 * */

/**
 * ====== TESTES =======
 * - Pirâmede de tests:
 * 1 - topo: Testes e2e
 * 2 - meio: testes de integração
 * 3 - base: testes unitários
 * 
 * obs: Trabalharemos apenas com teste end-to-end
 * 
 * supertest -> biblioteca responsáverl por criar testes e2e na nossa aplicação
 * 
 * app -> nós utilizaresmo o app de forma separada do server.ts para que seja possível criar um server de desenvolvimento
 * separado da código de produção.
 * 
 * Teste end-to-end(e2e): no backend, os testes e2e representam toda parte que o front-end pode consumir da aplicação, como rotas http, websockets etc.
 */

describe('transactions routes', () => {
    // Antes de criar os testes, precisa-se esperar que toda aplicação tenha iniciado, faremos o seguinte:
    beforeAll(async () => {
        await app.ready(); //só iniciará os testes quando a aplicação estiver preparada
    });

    afterAll(async () => {
        await app.close(); //fecharemos a aplicação quando todos testes tiverem sido feitos para que não fique nada em memória
    });

    /** 
    * Como é preciso para cada teste haver um ambiente totalmente novo e independente, precisamos 
    * apagar todas as tabelas do DB e recriá-las de novo a cada teste.
    */
    beforeEach(() => {
        execSync("npx knex migrate:latest");

    });

    afterEach(() => {
        execSync("npx knex migrate:rollback --all");
    })

    it('should be able to create a new transaction', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'NEW TRANSACTION',
                amount: 700,
                type: 'credit'
            })
            .expect(201); //poderiamos utilizar o expect do vitest, mas o proprio supertest nos dá essa opção
    });

    it('should be able to list all transactions', async () => {
        const transactionsPostResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'NEW TRANSACTION',
                amount: 700,
                type: 'credit'
            });

        const cookie = transactionsPostResponse.get('Set-Cookie');

        const getFirstTransactionId = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookie!);

        expect(getFirstTransactionId.body).toEqual({
            total: 1,
            transactions: [
                expect.objectContaining({
                    title: 'NEW TRANSACTION',
                    amount: 700,
                    type: 'credit'
                })
            ]
        })
    });

    it('should be able to list one transaction', async () => {
        const transactionsPostResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'NEW TRANSACTION',
                amount: 700,
                type: 'credit'
            });

        const cookie = transactionsPostResponse.get('Set-Cookie');

        const getFirstTransactionId = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookie!);

        const transactionId = getFirstTransactionId.body.transactions[0].id;

        const getOneTransaction = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookie!);

        expect(getOneTransaction.body).toEqual({
            transactions: expect.objectContaining({
                title: 'NEW TRANSACTION',
                amount: 700,
                type: 'credit'
            })
        })
    });

    it('should be able to list transactions summary', async () => {
        const transactionsPostResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'NEW CREDIT TRANSACTION',
                amount: 9000,
                type: 'credit'
            });

        const cookie = transactionsPostResponse.get('Set-Cookie');

        await request(app.server)
            .post('/transactions')
            .set('Cookie', cookie!)
            .send({
                title: 'NEW DEBIT TRANSACTION',
                amount: 4500,
                type: 'debit'
            });

        const getTransactionsSummary = await request(app.server)
            .get(`/transactions/summary`)
            .set('Cookie', cookie!);

        expect(getTransactionsSummary.body).toEqual({
            summary: {
                total: 2,
                amount: 4500
            }
        })
    })
})
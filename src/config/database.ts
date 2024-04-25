import { knex as setupKnex, Knex } from "knex";
import { env } from "../env";

/**
 * Knex é um query builder que é responsável por criar queries de banco de dados
 * diferentement de ORM's, os Query Builders são trabalhado de uma forma menos abstrata
 * o Knex, por sua vez, ele trabalha com criação de queries em forma de funções javascript
 * 
 * - Comandos Knex
 * npx knex -h -> help de comandos
 * npx knex migrate:make <name> -> cria um nova migration
 * npx knex migrate:latest -> ele adiciona a nova migration ao banco  de dados
 * npx knex migrate:rollback -> reverte a ultima migration aplicada 
 * npx knex migrate:lsit | migrate:status -> retorna o status de todas as migrations
 */

const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: env.DATABASE_URL!,
    },
    migrations: {
        extension: 'ts',
        directory: './src/database/migrations'
    },
    useNullAsDefault: true
}

const knex = setupKnex(config);

export { knex, config }
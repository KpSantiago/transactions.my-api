import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (table) => {
        table.enum('type', ['debit', 'credit']).notNullable().defaultTo('credit');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (tables) => {
        tables.dropColumn('type');
    })
}


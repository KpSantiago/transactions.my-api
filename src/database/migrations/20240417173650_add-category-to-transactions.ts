import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("transactions", (table) => {
        table.enum('category', ['food', 'travel', 'clothes', 'games', 'job', 'others']).defaultTo('others')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("transactions", (table) => {
        table.dropColumn('category')
    })
}


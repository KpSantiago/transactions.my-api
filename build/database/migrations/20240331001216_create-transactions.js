"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/database/migrations/20240331001216_create-transactions.ts
var create_transactions_exports = {};
__export(create_transactions_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(create_transactions_exports);
async function up(knex) {
  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary();
    table.text("title").notNullable();
    table.decimal("amount", 10, 2).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
}
async function down(knex) {
  knex.schema.dropTable("transactions");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});

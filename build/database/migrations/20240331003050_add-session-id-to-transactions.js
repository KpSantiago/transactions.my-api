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

// src/database/migrations/20240331003050_add-session-id-to-transactions.ts
var add_session_id_to_transactions_exports = {};
__export(add_session_id_to_transactions_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(add_session_id_to_transactions_exports);
async function up(knex) {
  await knex.schema.alterTable("transactions", (table) => {
    table.uuid("session_id").after("id").index();
  });
}
async function down(knex) {
  await knex.schema.alterTable("transactions", (table) => table.dropColumn("session_id"));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});

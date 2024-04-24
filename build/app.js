"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));

// src/config/database.ts
var import_knex = require("knex");

// src/env/index.ts
var import_zod = require("zod");
var import_dotenv = require("dotenv");
if (process.env.NODE_ENV == "test") {
  (0, import_dotenv.config)({
    path: ".env.test"
  });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success == false) {
  console.log("A invalid enviroment variables", _env.error.format());
  throw new Error();
}
var env = _env.data;

// src/config/database.ts
var config2 = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL
  },
  migrations: {
    extension: "ts",
    directory: "./src/database/migrations"
  },
  useNullAsDefault: true
};
var knex = (0, import_knex.knex)(config2);

// src/routes/transactions.ts
var import_node_crypto = require("crypto");
var import_zod2 = require("zod");

// src/middlewares/check-session-id-existence.ts
async function checkSessionIdExistence(request, reply) {
  const { sessionId } = request.cookies;
  if (!sessionId) {
    return reply.status(401).send({
      error: "Unauthorized."
    });
  }
}

// src/routes/transactions.ts
async function transactionsRoutes(app2) {
  app2.get(
    "/",
    {
      preHandler: [checkSessionIdExistence]
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const transactions = await knex("transactions").where("session_id", sessionId).select("*").orderBy("created_at", "desc");
      return { total: transactions.length, transactions };
    }
  );
  app2.get(
    "/:id",
    {
      preHandler: [checkSessionIdExistence]
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const getRequestParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = getRequestParamsSchema.parse(request.params);
      const transactions = await knex("transactions").where({ session_id: sessionId, id }).first();
      return { transactions };
    }
  );
  app2.get(
    "/summary",
    {
      preHandler: [checkSessionIdExistence]
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const summary = await knex("transactions").where("session_id", sessionId).count("id", { as: "total" }).sum("amount", { as: "amount" }).first();
      return { summary };
    }
  );
  app2.post("/", async (request, reply) => {
    const bodySchema = import_zod2.z.object({
      title: import_zod2.z.string(),
      amount: import_zod2.z.number(),
      type: import_zod2.z.enum(["debit", "credit"]),
      category: import_zod2.z.enum(["food", "travel", "clothes", "games", "job", "others"])
    });
    const { title, amount, type, category } = bodySchema.parse(request.body);
    let sessionId = request.cookies.sessionId;
    if (!sessionId) {
      sessionId = (0, import_node_crypto.randomUUID)();
      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
        // 7 days
      });
    }
    await knex("transactions").insert({
      id: (0, import_node_crypto.randomUUID)(),
      title,
      amount: type == "credit" ? amount : amount * -1,
      type,
      category,
      session_id: sessionId
    });
    return reply.status(201).send();
  });
  app2.put(
    "/end-session",
    {
      preHandler: [checkSessionIdExistence]
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      await knex("transactions").where("session_id", sessionId).delete("*");
      return reply.status(204).send();
    }
  );
}

// src/app.ts
var import_cookie = __toESM(require("@fastify/cookie"));
var import_cors = __toESM(require("@fastify/cors"));
var app = (0, import_fastify.default)();
app.addHook("preHandler", async (request, reply) => {
  console.log(`${request.method} ${request.url}`);
});
app.register(import_cookie.default);
app.register(import_cors.default, {
  origin: true,
  credentials: true
});
app.register(transactionsRoutes, { prefix: "transactions" });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});

import { FastifyInstance } from "fastify";
import { knex } from "../config/database";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { checkSessionIdExistence } from "../middlewares/check-session-id-existence";

// plugins são basicamente a capacidade de separar pequenos pedaços da nossa aplicação em mais arquivos
export async function transactionsRoutes(app: FastifyInstance) {
    /**
     * trablhando com hooks globais no fastify
     * utliza-se o 'addHook()' neste caso 
     * param1: tipo envento
     * param2: function
     * obs: só funcionará neste contextgo
     *  */
    // app.addHook('preHandler', async (request, reply) => {
    //     console.log(`${request.method} ${request.url}`)
    // })

    app.get('/',
        {
            preHandler: [checkSessionIdExistence]
        },
        async (request, reply) => {
            const { sessionid } = request.headers;

            const transactions = await knex('transactions').where('session_id', sessionid!.toString()).select('*').orderBy('created_at', 'desc');

            return { total: transactions.length, transactions }

        }
    )

    app.get('/:id',
        {
            preHandler: [checkSessionIdExistence]
        },
        async (request, reply) => {
            const { sessionid } = request.headers;

            const getRequestParamsSchema = z.object({
                id: z.string().uuid(),
            });

            const { id } = getRequestParamsSchema.parse(request.params)

            const transactions = await knex('transactions').where({ session_id: sessionid!.toString(), id }).first();

            return { transactions }
        }
    )


    app.get('/summary',
        {
            preHandler: [checkSessionIdExistence]
        },
        async (request, reply) => {
            const { sessionid } = request.headers;

            const summary = await knex('transactions').where('session_id', sessionid!.toString()).count('id', { as: 'total' }).sum('amount', { as: 'amount' }).first();

            return { summary }
        }
    )

    app.post("/", async (request, reply) => {
        const bodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['debit', 'credit']),
            category: z.enum(['food', 'travel', 'clothes', 'games', 'job', 'others'])
        });

        const { title, amount, type, category } = bodySchema.parse(request.body);

        // Trabalhando com cookies
        let { sessionid } = request.headers;

        let createSessionId = sessionid ? sessionid.toString() : randomUUID()

        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amount: type == 'credit' ? amount : amount * -1,
            type,
            category,
            session_id: createSessionId,
        });

        if (!sessionid) {
            return reply.status(201).send({
                sessionId: createSessionId
            })

        } else {
            return reply.status(201).send();
        }

    });

    app.patch('/',
        {
            preHandler: [checkSessionIdExistence]
        },
        async (request, reply) => {
            const { sessionid } = request.headers;

            const bodySchema = z.object({
                id: z.string(),
                title: z.string(),
                amount: z.number(),
                type: z.enum(['debit', 'credit']),
                category: z.enum(['food', 'travel', 'clothes', 'games', 'job', 'others'])
            });

            const { id, title, amount, type, category } = bodySchema.parse(request.body);

            await knex('transactions').where({ id, session_id: sessionid!.toString() }).update({
                title,
                amount: type == 'credit' ? amount : amount * -1,
                type,
                category,
            });

            return reply.status(204).send({})
        }
    )

    app.put('/end-session',
        {
            preHandler: [checkSessionIdExistence]
        },
        async (request, reply) => {
            const { sessionid } = request.headers;

            await knex('transactions').where('session_id', sessionid).delete('*');

            return reply.status(204).send()
        }
    )
}
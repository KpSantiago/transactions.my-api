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
            const { sessionId } = request.cookies;

            const transactions = await knex('transactions').where('session_id', sessionId).select('*').orderBy('created_at', 'desc');

            return { total: transactions.length, transactions }

        }
    )

    app.get('/:id',
        {
            preHandler: [checkSessionIdExistence]
        },
        async (request, reply) => {
            const { sessionId } = request.cookies;

            const getRequestParamsSchema = z.object({
                id: z.string().uuid(),
            });

            const { id } = getRequestParamsSchema.parse(request.params)

            const transactions = await knex('transactions').where({ session_id: sessionId, id }).first();

            return { transactions }
        }
    )


    app.get('/summary',
        {
            preHandler: [checkSessionIdExistence]
        },
        async (request, reply) => {
            const { sessionId } = request.cookies;

            const summary = await knex('transactions').where('session_id', sessionId).count('id', { as: 'total' }).sum('amount', { as: 'amount' }).first();

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
        let sessionId = request.cookies.sessionId;

        if (!sessionId) {
            sessionId = randomUUID();

            reply.setCookie('sessionId', sessionId, {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
                sameSite: 'lax',
            })

        }
        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amount: type == 'credit' ? amount : amount * -1,
            type,
            category,
            session_id: sessionId,
        });

        return reply.status(201).send();

    });

    app.put('/end-session',
        {
            preHandler: [checkSessionIdExistence]
        },
        async (request, reply) => {
            const { sessionId } = request.cookies;

            await knex('transactions').where('session_id', sessionId).delete('*');

            return reply.status(204).send()
        }
    )
}
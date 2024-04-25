import fastify from "fastify";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";

const app = fastify();

/**
 * Para se utilizar plugins ou outros middlewares, utiliza-se o método .register()
 * Sabendo que será utilizado os mesmo nome para todas url
 * podemos utlizar dentro do resgiter o parametro {prefix: 'nome_do_prefixo'}
*/


// funcionará para todas as rotas da aplciação
app.addHook('preHandler', async (request, reply) => {
    console.log(`${request.method} ${request.url}`)
})

app.register(cookie);
app.register(cors, {
    origin: ["https://transactions-my.netlify.app", "http://localhost:4200"],
    credentials: true,
    maxAge: 60 * 60 * 24 * 7 // 7 days
})

app.register(transactionsRoutes, { prefix: 'transactions' });

export { app }

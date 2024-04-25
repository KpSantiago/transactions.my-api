import { FastifyReply, FastifyRequest } from "fastify";

export async function checkSessionIdExistence(request: FastifyRequest, reply: FastifyReply) {
    const { sessionid } = request.headers;
    if (!sessionid) {
        return reply.status(401).send({
            error: 'Unauthorized.'
        })
    }
}
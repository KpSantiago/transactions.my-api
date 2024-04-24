import { FastifyReply, FastifyRequest } from "fastify";

export async function checkSessionIdExistence(request: FastifyRequest, reply: FastifyReply) {
    const { sessionId } = request.cookies;
    console.log(sessionId)
    if (!sessionId) {
        return reply.status(401).send({
            error: 'Unauthorized.'
        })
    }
}
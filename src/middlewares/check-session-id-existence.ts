import { FastifyReply, FastifyRequest } from "fastify";
import csrfProtection from "@fastify/csrf-protection";

export async function checkSessionIdExistence(request: FastifyRequest, reply: FastifyReply) {
    const { sessionId } = request.cookies;
    if (!sessionId) {
        return reply.status(401).send({
            error: 'Unauthorized.'
        })
    }
}
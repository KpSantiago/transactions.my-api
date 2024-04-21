// Zod é uma biblioteca que serve para a validação de dados
import { z } from "zod";
import { config } from "dotenv";

if (process.env.NODE_ENV == 'test') {
    config({
        path: '.env.test'
    })

} else {
    config();
}

// Schema é um formato de dado, ou seja, é basicamente como fossea definição de dados que algo deve ter
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default("development"),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333)
})

const _env = envSchema.safeParse(process.env);

if (_env.success == false) {
    console.log("A invalid enviroment variables", _env.error.format());
    throw new Error()
}

export const env = _env.data;
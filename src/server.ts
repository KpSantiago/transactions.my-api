import { app } from "./app";
import { env } from "./env";

app.listen({ port: env.PORT }).then(() => console.log('Listening on port 3333'))
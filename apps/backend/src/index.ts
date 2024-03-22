import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .get("/", () => ({
    message: "Hello World",
  }))
  .post(
    "/save",
    ({ body: { level } }) => {
      console.log("save level", level);

      return {
        message: "level saved",
      };
    },
    {
      body: t.Object({ level: t.String() }),
    }
  )
  .listen(8080);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

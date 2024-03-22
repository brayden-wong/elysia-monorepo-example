import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { database } from "./db";
import {
  levels,
  levels as levelsSchema,
  point,
  point as PointSchema,
} from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Elysia()
  .use(cors())
  .use(database)
  .get("/", async ({ db }) => {
    const levels = await db.query.levels.findMany({ with: { points: true } });

    for (const level of levels) {
      await db.delete(levelsSchema).where(eq(levelsSchema.id, level.id));
      await db.delete(point).where(eq(point.levelId, level.id));
    }
  })
  .get(
    "/levels",
    async ({ db }) =>
      await db.query.levels.findMany({
        with: {
          points: true,
        },
      })
  )
  .post(
    "/save",
    async ({ db, body: { name, points } }) => {
      console.log(name, points);
      const result = await db.transaction(async (tx) => {
        const level = await tx.query.levels.findFirst({
          where: eq(levels.name, name),
        });

        if (level) {
          for (const point of points) {
            await tx.insert(PointSchema).values({
              levelId: level.id,
              x: point[0],
              y: point[1],
            });
          }

          return level.id;
        }

        const [levelId] = await tx
          .insert(levels)
          .values({ name })
          .returning({ id: levels.id });

        console.log("Level ID", levelId.id);

        for (const [x, y] of points) {
          await tx.insert(point).values({ levelId: levelId.id, x, y });
        }

        return levelId.id;
      });

      console.log("Level saved", result);

      return { id: result };
    },
    {
      body: t.Object({
        name: t.String(),
        points: t.Array(t.Array(t.Number(), t.Number())),
      }),
    }
  )
  .listen(8080, () => console.log(`🦊 Elysia is running at port 8080`));

export type App = typeof app;

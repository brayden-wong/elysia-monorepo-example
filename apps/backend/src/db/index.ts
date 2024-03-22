import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import Elysia from "elysia";
import * as schema from "./schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { logger: true, schema });

export const database = new Elysia({ name: "db" }).decorate("db", db);

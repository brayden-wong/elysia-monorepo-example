import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

const MAX_LENGTH = 21;

export const levels = sqliteTable("levels", {
  id: text("id", { length: MAX_LENGTH })
    .primaryKey()
    .$defaultFn(() => nanoid(MAX_LENGTH)),
  name: text("name", { length: 64 }),
  segmentA: text("segment_a", { length: 64 }),
  segmentB: text("segment_b", { length: 64 }),
  segmentC: text("segment_c", { length: 64 }),
  segmentD: text("segment_d", { length: 64 }),
  segmentE: text("segment_e", { length: 64 }),
});

export const point = sqliteTable("point", {
  id: text("id", { length: MAX_LENGTH })
    .primaryKey()
    .$defaultFn(() => nanoid(MAX_LENGTH)),
  levelId: text("level_id", { length: MAX_LENGTH })
    .notNull()
    .references(() => levels.id),
  x: integer("x", { mode: "number" }).notNull(),
  y: integer("y", { mode: "number" }).notNull(),
});

export const pointRelations = relations(point, ({ one }) => ({
  level: one(levels, {
    fields: [point.levelId],
    references: [levels.id],
  }),
}));

export const levelRelations = relations(levels, ({ many }) => ({
  points: many(point),
}));

import { sql } from "drizzle-orm";
import {
    pgTable,
    uuid,
    boolean,
    timestamp,
    text,
    unique,
} from "drizzle-orm/pg-core";
import { usersTable } from "./auth.schema.js";

export const pollsTable = pgTable("polls", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    creatorId: uuid("creator_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),

    question: text("question").notNull(),

    options: text("options").array().notNull(),

    isActive: boolean("is_active").default(true).notNull(),

    isPublic: boolean("is_public").default(true).notNull(),

    allowMultipleVotes: boolean("allow_multiple_votes")
        .default(false)
        .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    expiresAt: timestamp("expires_at", { withTimezone: true }).default(
        sql`NOW() + INTERVAL '1 day'`,
    ),
});

export const votesTable = pgTable(
    "votes",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        userId: uuid("user_id")
            .notNull()
            .references(() => usersTable.id, { onDelete: "cascade" }),
        pollId: uuid("poll_id")
            .notNull()
            .references(() => pollsTable.id, { onDelete: "cascade" }),
        option: text("option").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [unique("user_poll_unique_vote").on(table.userId, table.pollId)],
);

import { getTableColumns } from "drizzle-orm";
import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp,
    pgEnum,
    text,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),

    authId: varchar("auth_id", { length: 255 }).unique(),

    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }),

    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),

    password: varchar("password", { length: 255 }),

    role: userRoleEnum("role").default("user").notNull(),

    refreshToken: text("refresh_token"),

    verificationToken: text("verification_token"),

    resetPasswordToken: text("reset_token"),
    resetPasswordExpiry: timestamp("reset_token_expiry", {
        withTimezone: true,
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
        () => new Date(),
    ),
});

const { password, ...publicColumns } = getTableColumns(usersTable);
export const userPublicColumns = publicColumns;

export const contactTable = pgTable("contacts", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 255 }),

    subject: varchar("subject", { length: 50 }).notNull(),

    email: varchar("email", { length: 255 }).notNull().unique(),

    phone: varchar("phone", { length: 50 }),

    message: varchar("message").notNull().default(""),
});

import { bigint, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("auth_user", {
	id: varchar("id", { length: 15 }).primaryKey(),
	firstName: text("firstName"),
	lastName: text("lastName"),
	email: text("email"),
});

export const session = pgTable("user_session", {
	id: varchar("id", {
		length: 128,
	}).primaryKey(),
	userId: varchar("user_id", { length: 15 })
		.notNull()
		.references(() => user.id),
	activeExpires: bigint("active_expires", {
		mode: "number",
	}).notNull(),
	idleExpires: bigint("idle_expires", {
		mode: "number",
	}).notNull(),
});

export const key = pgTable("user_key", {
	id: varchar("id", {
		length: 255,
	}).primaryKey(),
	userId: varchar("user_id", { length: 15 })
		.notNull()
		.references(() => user.id),
	hashedPassword: varchar("hashed_password", {
		length: 255,
	}),
});

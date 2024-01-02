import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

import { env } from "$env/dynamic/private";

export const queryClient = postgres({
	host: env.DATABASE_HOST ?? "127.0.0.1",
	port: Number(env.DATABASE_PORT) ?? 5432,
	database: env.DATABASE_NAME ?? "postgres",
	username: env.DATABASE_USER ?? "postgres",
	password: env.DATABASE_PASSWORD ?? "password",
});
export const db = drizzle(queryClient, { schema });

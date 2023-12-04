import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createTRPCSvelteServer } from "trpc-svelte-query/server";

import { DATABASE_URL } from "$env/static/private";

import { migrate } from "drizzle-orm/postgres-js/migrator";
import { createContext } from "./context";
import { appRouter } from "./routes/_app";

// Automated migrations go BRRR
const migrationClient = postgres(DATABASE_URL, { max: 1 });
migrate(drizzle(migrationClient), {
	migrationsFolder: "./drizzle/migrations",
});

const client = postgres(DATABASE_URL);
export const db = drizzle(client);

export const trpcServer = createTRPCSvelteServer({
	endpoint: "/api/trpc",
	router: appRouter,
	createContext,
});

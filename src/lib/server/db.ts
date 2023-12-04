import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "$env/dynamic/private";

import { migrate } from "drizzle-orm/postgres-js/migrator";

const DB_CONNECTION_OPTIONS: postgres.Options<Record<string, never>> = {
  host: env.DATABASE_HOST ?? "127.0.0.1",
  port: Number(env.DATABASE_PORT) ?? 5432,
  username: env.DATABASE_USER ?? 'postgres',
  password: env.DATABASE_PASSWORD ?? "password",
}

// Automated migrations go BRRR
const migrationClient = postgres({
  ...DB_CONNECTION_OPTIONS,
  max: 1,
});
migrate(drizzle(migrationClient), {
  migrationsFolder: "./drizzle/migrations",
});

export const queryClient = postgres(DB_CONNECTION_OPTIONS);
export const db = drizzle(queryClient);


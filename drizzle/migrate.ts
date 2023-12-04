import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const migrateClient = postgres({
	host: process.env.DATABASE_HOST ?? "127.0.0.1",
	port: Number(process.env.DATABASE_PORT) ?? 5432,
	database: process.env.DATABASE_NAME ?? "postgres",
	username: process.env.DATABASE_USER ?? "postgres",
	password: process.env.DATABASE_PASSWORD ?? "password",
max: 1
});
const db = drizzle(migrateClient);
await migrate(db, {
  migrationsFolder: './drizzle/migrations',
});
await migrateClient.end();
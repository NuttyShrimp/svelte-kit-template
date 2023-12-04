import type { Config } from "drizzle-kit";

export default {
  schema: "src/lib/server/schema.ts",
  out: "drizzle/migrations",
  driver: 'pg',
  dbCredentials: {
    host: process.env.DATABASE_HOST ?? "127.0.0.1",
    database: process.env.DATABASE_NAME ?? "postgres",
    port: Number(process.env.DATABASE_PORT) ?? 5432,
    user: process.env.DATABASE_USER ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? "password",
  }
} satisfies Config;

import type { Config } from "drizzle-kit";
import { env } from "$lib/env.mjs";

export default {
  schema: "src/lib/server/schema.ts",
  out: "drizzle/migrations",
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  }
} satisfies Config;

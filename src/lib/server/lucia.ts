import { lucia } from "lucia";
import { NODE_ENV } from "$env/static/private"
import { sveltekit } from "lucia/middleware";
import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import { queryClient } from "./db";
import "lucia/polyfill/node";

export const auth = lucia({
  env: NODE_ENV === 'production' ? "PROD" : "DEV",
  middleware: sveltekit(),
  adapter: postgresAdapter(queryClient, {
    user: "auth_user",
    key: "user_key",
    session: "user_session"
  }),
  getUserAttributes: () => {
    return {
      // put here what we want to store in the session & do not forget to change app.d.ts & the auth_user db schema
    }
  }
})

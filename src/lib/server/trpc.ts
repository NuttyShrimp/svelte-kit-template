import { transformer } from "$lib/trpc/transformer";
import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import { createTRPCSvelteServer } from "trpc-svelte-query/server";
import { createContext } from "./context";
import { appRouter } from "./routes/_app";

const t = initTRPC.context<Context>().create({
  transformer,
});

export const router = t.router;

export const trpcServer = createTRPCSvelteServer({
  endpoint: "/api/trpc",
  router: appRouter,
  createContext,
});

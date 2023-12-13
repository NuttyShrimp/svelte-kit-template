import { router } from "../trpc";
import { mailDevRouter } from "./dev/mailRender";

export const appRouter = router({
	dev: mailDevRouter,
});

export type AppRouter = typeof appRouter;

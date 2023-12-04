import { transformer } from "$lib/trpc/transformer";
import type { RequestEvent } from "@sveltejs/kit";
import { TRPCError, initTRPC } from "@trpc/server";
import {} from "@trpc/server";
import type { Session } from "lucia";

export const createContext = async ({ locals }: RequestEvent): Promise<{ session: Session | null }> => {
	const session = await locals.auth.validate();
	return {
		session,
	};
};

const t = initTRPC.context<typeof createContext>().create({
	transformer,
});

export const router = t.router;

export const publicProcedure = t.procedure;

const enforceUserAuthentication = t.middleware(({ ctx, next }) => {
	if (!ctx.session.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: {
			session: { ...ctx.session, user: ctx.session.user },
		},
	});
});

export const protectedProcedure = t.procedure.use(enforceUserAuthentication);

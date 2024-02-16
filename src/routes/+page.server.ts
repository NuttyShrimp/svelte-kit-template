import { auth } from "$lib/server/lucia";
import { fail } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	return {
		userId: locals.session?.userId,
	};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		if (!locals.session) return fail(401);
		await auth.invalidateSession(locals.session.id); // invalidate session
	},
};

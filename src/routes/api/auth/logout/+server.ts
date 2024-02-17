import { auth } from '$lib/server/lucia';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.session) error(401);
	await auth.invalidateSession(locals.session.id); // invalidate session
	redirect(301, '/');
};

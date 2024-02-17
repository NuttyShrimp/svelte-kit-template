import { LOGIN_REDIRECT } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) redirect(301, LOGIN_REDIRECT ?? '/');
	// If we would ever add more login options remove the following redirect
	redirect(301, '/login/azuread');
	// return {};
};

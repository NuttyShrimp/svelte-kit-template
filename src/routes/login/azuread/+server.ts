import { dev } from "$app/environment";
import { LOGIN_REDIRECT } from "$env/static/private";
import { azureADAuth } from "$lib/server/lucia";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies, locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: LOGIN_REDIRECT ?? "/",
			},
		});
	}

	const [url, verifier, state] = await azureADAuth.getAuthorizationUrl();
	cookies.set("azuread_oauth_verifier", verifier, {
		httpOnly: true,
		secure: !dev,
		path: "/",
		maxAge: 60 * 60,
	});
	cookies.set("azuread_oauth_state", state, {
		httpOnly: true,
		secure: !dev,
		path: "/",
		maxAge: 60 * 60,
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
};

import { LOGIN_REDIRECT } from "$env/static/private";
import { auth, azureADAuth } from "$lib/server/lucia.js";
import { OAuthRequestError } from "@lucia-auth/oauth";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: LOGIN_REDIRECT ?? "/",
			},
		});
	}
	const storedState = cookies.get("azuread_oauth_state");
	const codeVerifier = cookies.get("azuread_oauth_verifier");

	const state = url.searchParams.get("state");
	const code = url.searchParams.get("code");

	// validate state
	if (!storedState || !state || storedState !== state || !code || !codeVerifier) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const { getExistingUser, azureADUser, createUser } = await azureADAuth.validateCallback(code, codeVerifier);
		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;
			if (!azureADUser.email) {
				throw new Error("This azure user does not have an email attached");
			}
			const user = await createUser({
				attributes: {
					firstName: azureADUser.given_name,
					lastName: azureADUser.family_name,
					email: azureADUser.email,
				},
			});
			return user;
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {},
		});
		locals.auth.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: LOGIN_REDIRECT ?? "/",
			},
		});
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400,
			});
		}
		console.log(e);
		return new Response(null, {
			status: 500,
		});
	}
};

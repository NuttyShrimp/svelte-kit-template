import { LOGIN_REDIRECT } from "$env/static/private";
import { user } from "$lib/db/schema";
import { db } from "$lib/server/db";
import { auth, azureADAuth } from "$lib/server/lucia.js";
import type { RequestHandler } from "@sveltejs/kit";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	if (locals.session) {
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
		const tokens = await azureADAuth.validateAuthorizationCode(code, codeVerifier);

		const azureADRes = await fetch("https://graph.microsoft.com/v1.0/me", {
			headers: {
				authorization: `Bearer ${tokens.accessToken}`,
			},
		});
		const azureADUser: AzureADUser | AzureADError = await azureADRes.json();

		if ("error" in azureADUser) {
			throw new Error(azureADUser.error.message);
		}

		const existingUser = await db.query.user.findFirst({
			where: eq(user.uid, azureADUser.id),
		});

		let userId;

		if (!existingUser) {
			userId = generateId(15);
			await db.insert(user).values({
				id: userId,
				uid: azureADUser.id,
				email: azureADUser.mail,
				firstName: azureADUser.givenName,
				lastName: azureADUser.surname,
			});
		} else {
			userId = existingUser?.id;
		}

		const session = await auth.createSession(userId, {});
		const sessionCookie = auth.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes,
		});

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/",
			},
		});
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
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

type AzureADUser = {
	// The uid
	id: string;
	displayName: string;
	givenName: string;
	mail: string;
	surname: string;
};

type AzureADError = {
	error: {
		code: string;
		message: string;
	};
};

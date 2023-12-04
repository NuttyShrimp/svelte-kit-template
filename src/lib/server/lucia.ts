import { dev } from "$app/environment";
import {
	AZURE_AD_CLIENT_ID,
	AZURE_AD_CLIENT_SECRET,
	AZURE_AD_REDIRECT_URI,
	AZURE_AD_TENANT_ID,
} from "$env/static/private";
import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import { azureAD } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import "lucia/polyfill/node";
import { queryClient } from "./db";

export const auth = lucia({
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit(),
	adapter: postgresAdapter(queryClient, {
		user: "auth_user",
		key: "user_key",
		session: "user_session",
	}),
	getUserAttributes: (data): Lucia.DatabaseUserAttributes => {
		return {
			// put here what we want to store in the session & do not forget to change app.d.ts & the auth_user db schema
			email: data.email,
			lastName: data.lastName,
			firstName: data.firstName,
		};
	},
});

export const azureADAuth = azureAD(auth, {
	clientId: AZURE_AD_CLIENT_ID,
	clientSecret: AZURE_AD_CLIENT_SECRET,
	tenant: AZURE_AD_TENANT_ID,
	redirectUri: `${AZURE_AD_REDIRECT_URI}${AZURE_AD_REDIRECT_URI.endsWith("/") ? "" : "/"}login/azuread/callback`,
	scope: ["email"],
});

export type Auth = typeof auth;

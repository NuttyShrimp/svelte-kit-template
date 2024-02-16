import { dev } from "$app/environment";
import {
	AZURE_AD_CLIENT_ID,
	AZURE_AD_CLIENT_SECRET,
	AZURE_AD_REDIRECT_URI,
	AZURE_AD_TENANT_ID,
} from "$env/static/private";
import { type UserTable, session, user } from "$lib/db/schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { MicrosoftEntraId } from "arctic";
import { Lucia } from "lucia";
import { db } from "./db";

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const auth = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev,
		},
	},
	getUserAttributes: (data) => {
		return {
			// put here what we want to store in the session & do not forget to change app.d.ts & the user db schema
			email: data.email,
			lastName: data.lastName,
			firstName: data.firstName,
		};
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: Omit<UserTable, "id">;
	}
}

const redirectURI = `${AZURE_AD_REDIRECT_URI}${AZURE_AD_REDIRECT_URI.endsWith("/") ? "" : "/"}login/azuread/callback`;

export const azureADAuth = new MicrosoftEntraId(
	AZURE_AD_TENANT_ID,
	AZURE_AD_CLIENT_ID,
	AZURE_AD_CLIENT_SECRET,
	redirectURI,
);

export type Auth = typeof auth;

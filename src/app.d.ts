// See https://kit.svelte.dev/docs/types#app
declare global {
	namespace App {
		interface Locals {
			auth: import("lucia").AuthRequest;
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import("$lib/server/auth").Auth;
		// Declare the attributes here that you return inn `lucia.getUserAttributes`
		type DatabaseUserAttributes = {
			firstName: string;
			lastName: string;
			email: string;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};

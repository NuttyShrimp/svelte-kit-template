import { dev } from '$app/environment';
import { LOGIN_REDIRECT } from '$env/static/private';
import { azureADAuth } from '$lib/server/lucia';
import type { RequestHandler } from '@sveltejs/kit';
import { generateCodeVerifier, generateState } from 'arctic';

export const GET: RequestHandler = async ({ cookies, locals }) => {
	if (locals.session) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: LOGIN_REDIRECT ?? '/'
			}
		});
	}

	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const url = await azureADAuth.createAuthorizationURL(state, codeVerifier, {
		scopes: ['profile', 'email']
	});
	cookies.set('azuread_oauth_verifier', codeVerifier, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});
	cookies.set('azuread_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};

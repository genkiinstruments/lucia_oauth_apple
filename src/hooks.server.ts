import { auth } from '$lib/server/lucia';
import { error, json, text, type Handle } from '@sveltejs/kit';
import {sequence} from "@sveltejs/kit/hooks";

/**
 * CSRF protection copied from sveltekit but with the ability to turn it off for specific routes.
 */
const csrf =
	(allowedPaths: string[]): Handle =>
		async ({ event, resolve }) => {
			const forbidden =
				event.request.method === 'POST' &&
				event.request.headers.get('origin') !== event.url.origin &&
				isFormContentType(event.request) &&
				!allowedPaths.includes(event.url.pathname);

			if (forbidden) {
				const csrfError = error(
					403,
					`Cross-site ${event.request.method} form submissions are forbidden`,
				);
				if (event.request.headers.get('accept') === 'application/json') {
					return json(csrfError.body, { status: csrfError.status });
				}
				return text(csrfError.body.message, { status: csrfError.status });
			}

			return resolve(event);
		};
function isContentType(request: Request, ...types: string[]) {
	const type = request.headers.get('content-type')?.split(';', 1)[0].trim() ?? '';
	return types.includes(type);
}
function isFormContentType(request: Request) {
	return isContentType(request, 'application/x-www-form-urlencoded', 'multipart/form-data');
}

export const oauth_handle: Handle = async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
};

export const handle = sequence(csrf(['/login/apple/callback']), oauth_handle);
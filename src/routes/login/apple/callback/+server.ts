import { auth, appleAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';

export const POST = async ({ url, cookies, request, locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	const storedState = cookies.get('apple_oauth_state');
	const {state, code, user: userJSON} = Object.fromEntries(await request.formData());

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { getExistingUser, appleUser, createUser } =
			await appleAuth.validateCallback(code);

		console.log(appleUser);

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) {
				console.log('existing user', existingUser);

				return existingUser;
			}

			if (!appleUser.email) throw new Error("Email expected");

			const {name: {firstName, lastName}} = JSON.parse(userJSON);

			console.log("new user", firstName, lastName, appleUser);

			return await createUser({
				attributes: {
					username: `${firstName} ${lastName}`,
					email: appleUser.email,
				}
			});
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.auth.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	} catch (e) {
		console.error(e);

		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};

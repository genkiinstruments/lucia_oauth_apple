import { lucia } from 'lucia';
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite';
import { sveltekit } from 'lucia/middleware';
import { apple } from '@lucia-auth/oauth/providers';
import { dev } from '$app/environment';
import { APPLE_CLIENT_ID, APPLE_REDIRECT_URI, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_CERTIFICATE_FILE } from '$env/static/private';

import sqlite from 'better-sqlite3';
import fs from 'fs';

const db = sqlite(':memory:');
db.exec(fs.readFileSync('schema.sql', 'utf8'));

export const auth = lucia({
	adapter: betterSqlite3(db, {
		user: 'user',
		session: 'user_session',
		key: 'user_key'
	}),
	middleware: sveltekit(),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes: (data) => {
		return {
			username: data.username,
			email: data.email,
		};
	}
});

export const appleAuth = apple( auth, {
		clientId: APPLE_CLIENT_ID,
		redirectUri: APPLE_REDIRECT_URI,
		teamId: APPLE_TEAM_ID,
		keyId: APPLE_KEY_ID,
		scope: ['email', 'name'],
		responseMode: 'form_post', // Required to get email and name
		certificate: fs.readFileSync(APPLE_CERTIFICATE_FILE, 'utf8'),
	}
);

export type Auth = typeof auth;

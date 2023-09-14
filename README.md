# Apple OAuth example with Lucia and SvelteKit

This example uses SQLite3 with `better-sqlite3`.

```bash
# install dependencies
pnpm i

# setup .env
pnpm setup-env

# until lucia npm package is updated with latest changes to apple provider
git submodule update --init --recursive
pushd extern/lucia && pnpm ready && popd

# run dev server
pnpm dev
```

## Setup Apple OAuth

OAuth integration for Apple. Refer to Apple Docs:

* [Creating App ID](https://developer.apple.com/help/account/manage-identifiers/register-an-app-id/)
* [Creating Service ID](https://developer.apple.com/help/account/manage-identifiers/register-a-services-id)
* [Enable “Sign In with Apple” Capability](https://developer.apple.com/help/account/manage-identifiers/enable-app-capabilities)
* [Creating Private Key](https://developer.apple.com/help/account/manage-keys/create-a-private-key)
* [Locate the keyId](https://developer.apple.com/help/account/manage-keys/get-a-key-identifier)
* [How to locate your teamId](https://developer.apple.com/help/account/manage-your-team/locate-your-team-id)
* [Requesting Access Token](https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server)
* [How to validate tokens](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens)

```bash
APPLE_CLIENT_ID = ""
APPLE_TEAM_ID = ""
APPLE_KEY_ID = ""
APPLE_REDIRECT_URI = ""
APPLE_CERTIFICATE_FILE = "<path/to/certificate.p8>"
```

### Notes
* The user name and email fields are **only** provided for the first login. To reset, go to https://appleid.apple.com/account/manage -> Sign in with Apple -> Click the service name -> Stop using Sign in With Apple.
* The redirect URI does not work on localhost, so use a service like https://tunnelto.dev/ or a similar service.

## User schema

| id         | type     | unique |
|------------| -------- | :----: |
| `id`       | `string` |        |
| `username` | `string` |        |
| `email`    | `string` |        |

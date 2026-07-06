import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { isAuth0Configured } from "@/lib/auth/env";

let client: Auth0Client | null = null;

export function getAuth0() {
  if (!isAuth0Configured()) return null;
  if (!client) {
    client = new Auth0Client({
      appBaseUrl: process.env.APP_BASE_URL,
      signInReturnToPath: "/customize",
      authorizationParameters: {
        scope: "openid profile email",
      },
    });
  }
  return client;
}
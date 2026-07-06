import { Auth0Client } from "@auth0/nextjs-auth0/server";
import {
  isAuth0Configured,
  normalizeAppBaseUrl,
  normalizeAuth0Domain,
} from "@/lib/auth/env";

let client: Auth0Client | null = null;

export function getAuth0() {
  if (!isAuth0Configured()) return null;
  if (!client) {
    const domain = normalizeAuth0Domain(process.env.AUTH0_DOMAIN);
    if (!domain) return null;

    try {
      client = new Auth0Client({
        domain,
        appBaseUrl: normalizeAppBaseUrl(process.env.APP_BASE_URL),
        signInReturnToPath: "/customize",
        authorizationParameters: {
          scope: "openid profile email",
        },
      });
    } catch {
      return null;
    }
  }
  return client;
}
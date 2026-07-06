# Forgeara 2027

The smartest vehicle customization app — AI fit scoring, 3D preview, Auth0 login, and multi-store **Shopify** checkout.

## Features

- **Auth0 Login** — real sign-up/login, session cookies, protected garage
- **My Garage** — saved builds tied to your account (Prisma when DB connected)
- **AI Vehicle Detection** — auto-identifies make/model from your snap
- **5 Partner Shopify Stores** — wraps, rims, interior, lighting, performance
- **Authenticated Checkout** — Shopify cart requires login
- **Save & Share** — shareable `/build/[id]` links

## Quick Start

```bash
npm install
cp .env.example .env.local
openssl rand -hex 32   # paste as AUTH0_SECRET
npm run db:generate
npm run dev
```

## Auth0 Setup

1. Create a **Regular Web Application** at [manage.auth0.com](https://manage.auth0.com)
2. Set Allowed Callback URLs: `http://localhost:3000/auth/callback`
3. Set Allowed Logout URLs: `http://localhost:3000`
4. Copy **Auth0** Domain, Client ID, Client Secret into `.env.local` (not your Google Client ID):

```
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
AUTH0_SECRET=<openssl rand -hex 32>
APP_BASE_URL=http://localhost:3000
```

5. Restart `npm run dev` and click **Log in** or **Google**

### Google sign-in (via Auth0)

Your Google OAuth Client ID goes in **Auth0**, not in Forgeara's `.env`:

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → your OAuth client
2. **Authorized redirect URI** (required):

   ```
   https://YOUR_AUTH0_DOMAIN/login/callback
   ```

   Example: `https://dev-xxxxx.us.auth0.com/login/callback`

3. Auth0 Dashboard → **Authentication → Social → Google**
4. Paste **Google Client ID** + **Google Client Secret**, enable the connection
5. Auth0 → **Applications → Your app → Connections** → enable **google-oauth2**
6. In Forgeara, click **Google** in the header (uses `connection=google-oauth2`)

## Database (optional but recommended)

```bash
# Add DATABASE_URL to .env.local, then:
npm run db:push
```

Builds and accounts persist to PostgreSQL. Without a DB, builds use in-memory storage (resets on server restart).

## Shopify (optional)

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
```

## Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/auth/login` | — | Auth0 login |
| `/auth/logout` | — | Log out |
| `/garage` | Required | Your saved builds |
| `/customize` | — | Smart customizer |
| `/stores` | — | Shopify marketplace |
| `/build/[id]` | — | Shared build viewer |

## Stack

Next.js 16 • Auth0 • Prisma • Shopify Storefront API • React Three Fiber

Built with Grok in GitHub Codespaces.
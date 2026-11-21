# Vercel deployment

Vercel serves the patient form, staff dashboard, and print views. Its same-origin API rewrites forward requests to a dedicated Cloudflare Worker. The Worker uses a new D1 database and a private R2 bucket. The existing Sites project has a separate deployment configuration.

1. Install dependencies with `pnpm install --frozen-lockfile`. Sign into the intended Cloudflare account with `pnpm exec wrangler login`. The account needs Workers, D1, and R2 access.
2. In `deploy/wrangler.jsonc`, set `vars.FRONTEND_ORIGIN` to the production HTTPS origin (no trailing slash). Confirm that the named database and bucket are new in your account.
3. Run `pnpm exec wrangler deploy --config deploy/wrangler.jsonc` to provision the bindings and publish the API. Keep the bucket private.
4. Run `pnpm exec wrangler d1 migrations apply DB --remote --config deploy/wrangler.jsonc` and `pnpm exec wrangler secret put PHARMACY_KEY --config deploy/wrangler.jsonc`. Enter a new random URL-safe staff key at the secret prompt.
5. Set the Vercel production environment variable `PRESCRIPTION_API_ORIGIN` to the HTTPS origin printed by Wrangler. Use the repository root and its checked-in build settings. Clear any dashboard output-directory override. Redeploy.
6. Use a synthetic prescription to verify submission, staff login, file preview and the print queue. Check that a signed-out browser cannot read orders or uploaded files.

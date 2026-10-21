# Steam Hub (Cloudflare Pages + wrangler)

Layout: public/index.html (site) · functions/api/* (server code) · wrangler.toml (config)

1. Edit wrangler.toml: set STEAM_ID. (Optional: create KV and uncomment the kv block.)
2. In this folder:
   npx wrangler login
   npx wrangler pages project create steam-hub --production-branch main
   npx wrangler pages secret put STEAM_API_KEY --project-name steam-hub
   npx wrangler pages secret put SITE_PASSWORD --project-name steam-hub
   npx wrangler pages deploy
3. Steam > Profile > Privacy > Game details = Public.
4. Custom domain: Cloudflare dashboard > Workers & Pages > steam-hub > Custom domains.

Note: once wrangler.toml exists, it is the source of truth for variables and bindings;
values set in the dashboard are ignored, so keep STEAM_ID / KV in the file.
Local test: put STEAM_API_KEY=... and SITE_PASSWORD=... in a file named .dev.vars, then run: npx wrangler pages dev

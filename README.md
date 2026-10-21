# Steam Hub

Auto-syncing Steam library with banners, search of the whole Steam store, wishlist, must-play, star ratings and a head-to-head ranking.

## Deploy (free, about 10 minutes)
1. Create a GitHub repo and upload this folder (index.html + api/).
2. On vercel.com: Add New > Project > import the repo > Deploy.
3. Project > Settings > Environment Variables:
   - STEAM_API_KEY  (steamcommunity.com/dev/apikey)
   - STEAM_ID       (your 17-digit ID, see steamid.io)
   - SITE_PASSWORD  (any password; the site asks for it once per device)
   - optional, for sync across devices: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
     (Vercel > Storage > Marketplace > Upstash Redis > connect; it adds both automatically)
4. Redeploy. In Steam set Profile > Privacy > Game details to Public.
5. Domain: Vercel > Settings > Domains > add e.g. hub.itsmadebymo.com and create the DNS record Vercel shows.

New games appear within 2 minutes, when you refocus the tab, or when you press Sync now.
Without Upstash, ratings/wishlist are saved only in the browser you use.

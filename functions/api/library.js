export async function onRequest({ request, env }) {
  const j = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  if (!env.SITE_PASSWORD || request.headers.get('x-pass') !== env.SITE_PASSWORD) return j({ error: 'unauthorized' }, 401);
  if (!env.STEAM_API_KEY || !env.STEAM_ID) return j({ error: 'STEAM_API_KEY or STEAM_ID missing' }, 500);
  try {
    const r = await fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${env.STEAM_API_KEY}&steamid=${env.STEAM_ID}&include_appinfo=1&include_played_free_games=1&format=json`);
    if (!r.ok) return j({ error: 'steam_' + r.status }, 502);
    const games = ((await r.json()).response || {}).games;
    if (!games) return j({ private: true, games: [] });
    return j({ games: games.map(g => ({ id: String(g.appid), n: g.name, h: Math.round((g.playtime_forever || 0) / 6) / 10 })) });
  } catch (e) { return j({ error: 'fetch_failed' }, 502); }
}

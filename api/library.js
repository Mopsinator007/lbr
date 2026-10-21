// Returns the owner's Steam library. The API key stays on the server.
module.exports = async (req, res) => {
  const { SITE_PASSWORD, STEAM_API_KEY, STEAM_ID } = process.env;
  if (!SITE_PASSWORD || req.headers['x-pass'] !== SITE_PASSWORD) return res.status(401).json({ error: 'unauthorized' });
  if (!STEAM_API_KEY || !STEAM_ID) return res.status(500).json({ error: 'STEAM_API_KEY or STEAM_ID missing' });
  try {
    const u = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&include_appinfo=1&include_played_free_games=1&format=json`;
    const r = await fetch(u);
    if (!r.ok) return res.status(502).json({ error: 'steam_' + r.status });
    const j = await r.json();
    const games = j.response && j.response.games;
    if (!games) return res.status(200).json({ private: true, games: [] }); // Steam hides games when "Game details" is not public
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ games: games.map(g => ({ id: String(g.appid), n: g.name, h: Math.round((g.playtime_forever || 0) / 6) / 10 })) });
  } catch (e) { res.status(502).json({ error: 'fetch_failed' }); }
};

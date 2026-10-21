// Searches the whole Steam store catalogue.
module.exports = async (req, res) => {
  const { SITE_PASSWORD } = process.env;
  if (!SITE_PASSWORD || req.headers['x-pass'] !== SITE_PASSWORD) return res.status(401).json({ error: 'unauthorized' });
  const q = String(req.query.q || '').trim().slice(0, 80);
  if (q.length < 2) return res.status(200).json({ items: [] });
  try {
    const r = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(q)}&l=english&cc=us`);
    if (!r.ok) return res.status(502).json({ error: 'steam_' + r.status });
    const j = await r.json();
    res.setHeader('Cache-Control', 's-maxage=300');
    res.status(200).json({ items: (j.items || []).map(i => ({
      id: String(i.id), n: i.name, meta: i.metascore || '',
      price: i.price ? (i.price.final / 100).toFixed(2) + ' ' + i.price.currency : 'Free / n.a.' })) });
  } catch (e) { res.status(502).json({ error: 'fetch_failed' }); }
};

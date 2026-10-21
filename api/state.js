// Saves ratings / wishlist / ranking so they sync across devices (Upstash Redis).
module.exports = async (req, res) => {
  const { SITE_PASSWORD, UPSTASH_REDIS_REST_URL: U, UPSTASH_REDIS_REST_TOKEN: T } = process.env;
  if (!SITE_PASSWORD || req.headers['x-pass'] !== SITE_PASSWORD) return res.status(401).json({ error: 'unauthorized' });
  if (!U || !T) return res.status(501).json({ error: 'no_storage' }); // the site then falls back to this browser only
  const H = { Authorization: 'Bearer ' + T };
  try {
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (body.length > 900000) return res.status(413).end();
      await fetch(U, { method: 'POST', headers: H, body: JSON.stringify(['SET', 'steamhub', body]) });
      return res.status(200).json({ ok: true });
    }
    const r = await fetch(U + '/get/steamhub', { headers: H });
    const j = await r.json();
    res.status(200).json({ state: j.result ? JSON.parse(j.result) : null });
  } catch (e) { res.status(502).json({ error: 'storage_failed' }); }
};

export async function onRequest({ request, env }) {
  const j = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });
  if (!env.SITE_PASSWORD || request.headers.get('x-pass') !== env.SITE_PASSWORD) return j({ error: 'unauthorized' }, 401);
  const q = (new URL(request.url).searchParams.get('q') || '').trim().slice(0, 80);
  if (q.length < 2) return j({ items: [] });
  try {
    const r = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(q)}&l=english&cc=us`);
    if (!r.ok) return j({ error: 'steam_' + r.status }, 502);
    return j({ items: ((await r.json()).items || []).map(i => ({ id: String(i.id), n: i.name, meta: i.metascore || '',
      price: i.price ? (i.price.final / 100).toFixed(2) + ' ' + i.price.currency : 'Free / n.a.' })) });
  } catch (e) { return j({ error: 'fetch_failed' }, 502); }
}

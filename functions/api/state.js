// Saves ratings / wishlist / ranking in Cloudflare KV (binding name: STEAMHUB).
export async function onRequest({ request, env }) {
  const j = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });
  if (!env.SITE_PASSWORD || request.headers.get('x-pass') !== env.SITE_PASSWORD) return j({ error: 'unauthorized' }, 401);
  if (!env.STEAMHUB) return j({ error: 'no_storage' }, 501); // site falls back to this browser only
  if (request.method === 'POST') {
    const body = await request.text();
    if (body.length > 900000) return j({ error: 'too_large' }, 413);
    await env.STEAMHUB.put('state', body);
    return j({ ok: true });
  }
  const v = await env.STEAMHUB.get('state');
  return j({ state: v ? JSON.parse(v) : null });
}

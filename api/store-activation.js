export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Access-Control-Allow-Origin', 'https://go.niklaspedde.com'); // anpassen
  res.setHeader('Access-Control-Allow-Headers', 'content-type');

  try {
    const { client_id, activation_url } = req.body || {};
    if (!client_id || !activation_url) {
      return res.status(400).json({ error: 'missing fields' });
    }

    const base = process.env.UPSTASH_REDIS_REST_URL;      // z.B. https://refined-sawfly-13506.upstash.io
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;   // Token aus Upstash
    const ttlSec = 600; // 10 Minuten

    const r = await fetch(`${base}/set/${encodeURIComponent(client_id)}/${encodeURIComponent(activation_url)}?EX=${ttlSec}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!r.ok) return res.status(502).json({ error: 'upstash error' });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'server error' });
  }
}

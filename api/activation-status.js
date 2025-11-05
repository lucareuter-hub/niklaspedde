export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://go.niklaspedde.com'); // anpassen
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    return res.status(204).end();
  }
  if (req.method !== 'GET') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', 'https://go.niklaspedde.com'); // anpassen
  res.setHeader('Cache-Control', 'no-store');

  const client_id = req.query.client_id;
  if (!client_id) return res.status(400).json({ ready: false });

  const base = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  const r = await fetch(`${base}/get/${encodeURIComponent(client_id)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return res.status(502).json({ ready: false });

  const { result } = await r.json(); // activation_url oder null
  if (result) return res.status(200).json({ ready: true, activation_url: result });
  return res.status(200).json({ ready: false });
}

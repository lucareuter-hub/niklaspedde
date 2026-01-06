// For confirmation pages sync tracking parameters safe pass-through entity for n8n server

export default async function handler(req, res) {
  // ========== LOGGING: Eingang ==========
  console.log("Incoming request", {
    method: req.method,
    url: req.url,
    origin: req.headers.origin || '',
    referer: req.headers.referer || ''
  });

  const origin  = req.headers.origin  || '';
  const referer = req.headers.referer || '';

  const allowedOrigins = [
    'https://go.niklaspedde.com',
    'https://niklaspedde.com',
    'https://kuma.niklaspedde.com',
    'https://www.niklaspedde.com'
  ];

  const isAllowedOrigin =
    allowedOrigins.some(o => origin.startsWith(o)) ||
    allowedOrigins.some(o => referer.startsWith(o));

  // CORS für Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    console.log("OPTIONS preflight received");
    
    if (!isAllowedOrigin) {
      console.log("OPTIONS rejected: Forbidden origin");
      return res.status(403).end();
    }

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log("OPTIONS OK (204)");
    return res.status(204).end();
  }

  // Nur POST zulassen
  if (req.method !== 'POST') {
    console.log("Rejected non-POST request:", req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAllowedOrigin) {
    console.log("Forbidden origin for POST:", origin, referer);
    return res.status(403).json({ error: 'Forbidden origin' });
  }

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  const payload = req.body || {};

  // ========== LOGGING: Payload ==========
  console.log("Incoming POST payload:", payload);

  const n8nUrl    = process.env.N8N_WEBHOOK_URL;
  const n8nSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!n8nUrl || !n8nSecret) {
    console.log("Missing env vars for n8n");
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const upstream = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + n8nSecret
      },
      body: JSON.stringify(payload)
    });

    const text = await upstream.text();

    // ========== LOGGING: Antwort von n8n ==========
    console.log("n8n response", {
      status: upstream.status,
      body: text
    });

    if (!upstream.ok) {
      return res.status(502).json({
        error: 'n8n error',
        status: upstream.status,
        body: text
      });
    }

    return res.status(200).json({ status: 'ok' });

  } catch (e) {
    console.log("Upstream fetch error:", e);

    return res.status(500).json({
      error: 'Upstream request failed',
      message: e.message || null
    });
  }
}

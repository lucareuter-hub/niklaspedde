 // For confirmation pages sync tracking parameters safe pass-through entity for n8n server


export default async function handler(req, res) {
 
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body || {};

  const n8nUrl    = process.env.N8N_WEBHOOK_URL;
  const n8nSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!n8nUrl || !n8nSecret) {
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

    if (!upstream.ok) {
      return res.status(502).json({
        error: 'n8n error',
        status: upstream.status,
        body: text
      });
    }

    return res.status(200).json({ status: 'ok' });
  } catch (e) {
    return res.status(500).json({ error: 'Upstream request failed' });
  }
}


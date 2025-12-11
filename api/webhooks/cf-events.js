export default async function handler(req, res) {
  // Request-Body einlesen
  let body = {};
  if (req.method === "POST") {
    body = req.body || {};
  }

  // Optional: Logging in Vercel
  console.log("CF webhook hit", {
    method: req.method,
    url: req.url,
    body,
  });

  // An n8n weiterleiten (Production-Webhook-URL eintragen)
  try {
    await fetch("https://DEIN-N8N-HOST/webhook/DEIN-PFAD", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error("Error forwarding to n8n", e);
    // ClickFunnels sollte trotzdem ein 200 sehen, sonst retry-Spam
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ ok: true });
}

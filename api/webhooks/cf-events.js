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
    await fetch("https://n8n.niklaspedde.com/webhook-test/e3800a80-bbab-4a3c-9979-fe8fb8c7ed6e", {
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

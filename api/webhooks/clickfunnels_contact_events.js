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

  try {
    await fetch(
      "https://n8n.niklaspedde.com/webhook/clickfunnels_contact_events",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "n8n-webhook-secret": "526FAA78A46D4AE5CB993B4DBA218"
        },
        body: JSON.stringify(body),
      }
    );
  } catch (e) {
    console.error("Error forwarding to n8n", e);
    // ClickFunnels sollte trotzdem ein 200 sehen, sonst retry-Spam
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ ok: true });
}

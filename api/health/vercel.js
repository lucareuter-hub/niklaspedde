export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = req.headers["x-health-secret"] || "";

  if (process.env.HEALTH_SECRET && secret !== process.env.HEALTH_SECRET) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  return res.status(200).json({
    ok: true,
    service: "vercel",
    ts: Date.now()
  });
}

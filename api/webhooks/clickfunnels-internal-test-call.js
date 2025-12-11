export default function handler(req, res) {
  const now = new Date();

  const pad = (n) => String(n).padStart(2, "0");

  const timeStr =
    now.getUTCFullYear() +
    "-" +
    pad(now.getUTCMonth() + 1) +
    "-" +
    pad(now.getUTCDate()) +
    " " +
    pad(now.getUTCHours()) +
    ":" +
    pad(now.getUTCMinutes()) +
    ":" +
    pad(now.getUTCSeconds()) +
    " UTC";

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ time: timeStr });
}

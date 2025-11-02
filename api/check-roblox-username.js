export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST allowed" });
    return;
  }

  let username = "";
  try {
    // Vercel kadang mengirim req.body sebagai string
    if (typeof req.body === "string") {
      username = JSON.parse(req.body).username || "";
    } else {
      username = req.body.username || "";
    }
  } catch {
    username = "";
  }

  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  try {
    const robloxRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify

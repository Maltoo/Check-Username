export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST allowed" });
    return;
  }

  // Parse body secara manual jika bukan objek
  let username = "";
  try {
    if (typeof req.body === "string") {
      // Vercel kadang mengirim body sebagai string
      const json = JSON.parse(req.body);
      username = json.username || "";
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
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
    });
    const data = await robloxRes.json();

    if (data?.data?.length > 0 && data.data[0].requestedUsername) {
      res.status(200).json({ exists: true, user: data.data[0] });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to check username" });
  }
}

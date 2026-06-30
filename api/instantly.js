export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { campaign_id, email, first_name, last_name, company_name, custom_variables } = req.body;
  try {
    const response = await fetch("https://api.instantly.ai/api/v2/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.INSTANTLY_API_KEY}` },
      body: JSON.stringify({ campaign_id, email, first_name, last_name, company_name, custom_variables }),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) { return res.status(500).json({ error: err.message }); }
}
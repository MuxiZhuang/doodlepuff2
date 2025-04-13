export default async function handler(req, res) {
  const { image } = req.body;

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "This is a child's drawing. Describe what it looks like, what creature it could be, and its personality in JSON format with fields: type, description, personality." },
            { type: "image_url", image_url: { url: image } }
          ]
        }
      ],
      max_tokens: 300
    })
  });

  const data = await openaiRes.json();
  const reply = data.choices?.[0]?.message?.content;

  res.status(200).json({ result: reply });
}
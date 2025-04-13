export default async function handler(req, res) {
  const { image } = req.body;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "This is a child's drawing. Please respond with a JSON containing three fields: type (the kind of creature), description (what it looks like), and personality (its behavior or mood)." },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ result: "No reply content received from OpenAI." });
    }

    res.status(200).json({ result: reply });

  } catch (error) {
    console.error("Error in analyze API:", error);
    res.status(500).json({ result: "Error during GPT call." });
  }
}


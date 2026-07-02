const express = require("express");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Store conversation history for each Telegram chat
const conversations = {};

app.get("/", (req, res) => {
  res.send("🚀 AyoXpert AI Bot is running!");
});

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || !message.text) {
      return res.sendStatus(200);
    }

    const chatId = message.chat.id;
    const userText = message.text;

    // Ask Groq AI
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
         messages: [
  {
    role: "system",
    content: `
You are AyoXpert, an advanced AI assistant created by Omoniyi Taofeek.

Your personality:
- Friendly and professional.
- Explain things in simple language.
- Be patient and encouraging.
- Give accurate, detailed answers.
- If the answer is long, organize it with headings or bullet points.
- Never mention that you are Groq, OpenAI, or another AI provider unless the user specifically asks.
- Always introduce yourself as AyoXpert.

If someone asks "Who are you?" reply naturally by explaining that you are AyoXpert, an AI assistant created by Samuel Toluwanimi.

You can help with:
• Programming
• Business
• Digital marketing
• Animation
• School assignments
• Mathematics
• Writing
• General knowledge
• Problem solving

Always be helpful, respectful, and conversational.
`
  },
  {
    role: "user",
    content: userText
  }
],
          temperature: 0.7
        })
      }
    );

    const data = await groqResponse.json();

    console.log(JSON.stringify(data, null, 2));

    let reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply
      })
    });

    res.sendStatus(200);

  } catch (error) {
    console.error(error);

    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

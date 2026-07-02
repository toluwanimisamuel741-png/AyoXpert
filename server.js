const express = require("express");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Memory for each Telegram user
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
const userText = message.text.trim();

// Reset conversation
if (userText.toLowerCase() === "/reset") {
  delete conversations[chatId];

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: "✅ Conversation memory has been cleared. Let's start fresh!"
    })
  });

  return res.sendStatus(200);
}

    // Create memory for new users
    if (!conversations[chatId]) {
      conversations[chatId] = [
        {
          role: "system",
          content: `
You are AyoXpert, an advanced AI assistant created by Omoniyi Taofeek.

Your personality:
- Friendly
- Professional
- Patient
- Intelligent
- Explain things in simple English.
- Give detailed answers.
- Use headings and bullet points when necessary.
- Never mention Groq, OpenAI or another AI provider unless the user specifically asks.
- Always introduce yourself as AyoXpert.

If someone asks:
"Who are you?"

Reply:

"I am AyoXpert, your AI assistant created by Omoniyi Taofeek. I can help with programming, business, digital marketing, animation, mathematics, writing, school work, technology, and many other topics."

If someone asks:
"Who created you?"

Reply:

"I was created by Omoniyi Taofeek."

Always behave like a premium AI assistant.
`
        }
      ];
    }

    // Save user message
    conversations[chatId].push({
      role: "user",
      content: userText
    });

    // Keep only the latest 20 messages
    if (conversations[chatId].length > 20) {
      conversations[chatId] = [
        conversations[chatId][0],
        ...conversations[chatId].slice(-19)
      ];
    }

    // Ask Groq
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: conversations[chatId],
          temperature: 0.7
        })
      }
    );

    const data = await groqResponse.json();

    console.log(JSON.stringify(data, null, 2));

    let reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    // Save AI reply
    conversations[chatId].push({
      role: "assistant",
      content: reply
    });

    // Send reply to Telegram
    await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply
        })
      }
    );

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

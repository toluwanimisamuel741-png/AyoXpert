const express = require("express");
const { searchWeb } = require("./search");
const { handleCommand } = require("./commands");
const { handlePdf } = require("./pdf");
const {
  getConversation,
  addUserMessage,
  addAssistantMessage,
  resetConversation
} = require("./memory");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.get("/", (req, res) => {
  res.send("🚀 AyoXpert AI Bot is running!");
});

app.post("/webhook", async (req, res) => {
  try {

  const message = req.body.message;

if (!message) {
  return res.sendStatus(200);
}

const chatId = message.chat.id;

// Detect PDF
if (message.document) {
  await handlePdf(BOT_TOKEN, chatId);
  return res.sendStatus(200);
}

if (!message.text) {
  return res.sendStatus(200);
}

const userText = message.text.trim();

    // Handle Telegram commands
    const handled = await handleCommand(
      BOT_TOKEN,
      chatId,
      userText,
      resetConversation
    );

    if (handled) {
      return res.sendStatus(200);
    }

    // Show typing indicator
await fetch(
  `https://api.telegram.org/bot${BOT_TOKEN}/sendChatAction`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      action: "typing"
    })
  }
);

    // Decide if live search is needed
    const searchKeywords = [
      "today",
      "latest",
      "news",
      "current",
      "weather",
      "price",
      "bitcoin",
      "crypto",
      "stock",
      "football",
      "soccer",
      "score",
      "match",
      "breaking",
      "update"
    ];

    const needsSearch = searchKeywords.some(word =>
      userText.toLowerCase().includes(word)
    );

    let searchContext = "";

    if (needsSearch) {
      searchContext = await searchWeb(userText);
    }
    // Save the user's message
    addUserMessage(
      chatId,
      needsSearch
        ? `User Question:
${userText}

Live Search Results:
${searchContext}`
        : userText
    );

    // Get conversation history
    const messages = getConversation(chatId);

    // Ask Groq AI
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
          messages,
          temperature: 0.7
        })
      }
    );

    if (!groqResponse.ok) {
      throw new Error(`Groq API Error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();

    let reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    // Save AI reply into memory
    addAssistantMessage(chatId, reply);  
    // Send reply back to Telegram
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

    return res.sendStatus(200);

  } catch (error) {

    console.error("ERROR:", error);

    await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: req.body?.message?.chat?.id,
          text:
            "❌ Sorry, something went wrong while processing your request. Please try again."
        })
      }
    ).catch(() => {});

    return res.sendStatus(500);

  }

});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 AyoXpert is running on port ${PORT}`);
});

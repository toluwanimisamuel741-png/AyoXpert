const express = require("express");
const { searchWeb } = require("./search");
const { handleCommand } = require("./commands");
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

    if (!message || !message.text) {
      return res.sendStatus(200);
    }

    const chatId = message.chat.id;
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

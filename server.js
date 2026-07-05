const processedUpdates = new Set();
const message = req.body.message;
if (processedUpdates.has(message.message_id)) {
  return res.sendStatus(200);
}

processedUpdates.add(message.message_id);

setTimeout(() => {
  processedUpdates.delete(message.message_id);
}, 60000);
const { shouldSearch } = require("./decideSearch");
const {
  addUser,
  addMessage,
  addSearch,
  addPdf
} = require("./stats");

const { getDocument } = require("./documents");
const express = require("express");
const { searchWeb } = require("./search");
const { handleCommand } = require("./commands");
const { handlePdf } = require("./pdf");
const { handleImage } = require("./image");

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

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is missing.");
}

if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing.");
}

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
addUser(chatId);
    // ==========================
    // Handle PDF
    // ==========================

    if (message.document) {

      addPdf();

      await handlePdf(
        BOT_TOKEN,
        chatId,
        message.document
      );

      return res.sendStatus(200);

    }

    // ==========================
    // Handle Images
    // ==========================

    if (message.photo) {

      await handleImage(
        BOT_TOKEN,
        chatId,
        message.photo
      );

    return res.sendStatus(500);

    }

    if (!message.text) {
      return res.sendStatus(200);
    }

    const userText = message.text.trim();

    // ==========================
    // Commands
    // ==========================

    const handled = await handleCommand(
      BOT_TOKEN,
      chatId,
      userText,
      resetConversation
    );

    if (handled) {
      return res.sendStatus(200);
    }

    // ==========================
    // Loading Message
    // ==========================

    const loadingMessage = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🤔 Thinking..."
        })
      }
    );

    const loadingData = await loadingMessage.json();

    const loadingMessageId =
      loadingData.result.message_id;

    // ==========================
    // Live Search Detection
    // ==========================

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

    const needsSearch = await shouldSearch(userText);

    let searchContext = "";

    if (needsSearch) {

   await fetch(
  `https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: loadingMessageId,
      text: "🌍 Searching the web..."
    })
  }
);

searchContext = await searchWeb(userText);

addSearch();

    }

    // ==========================
    // PDF Context
    // ==========================

    const pdfText = getDocument(chatId);

    let extraContext = "";

    if (pdfText) {

      extraContext = `
PDF DOCUMENT:

${pdfText.substring(0,12000)}
`;

    }

    // ==========================
    // Final Prompt
    // ==========================

    let finalPrompt = userText;

    if (needsSearch) {

      finalPrompt += `

Live Search Results:

${searchContext}`;

    }

    if (pdfText) {

      finalPrompt += `

${extraContext}

If the user's question is about the uploaded PDF,
answer ONLY using the PDF.

If it isn't related,
answer normally.
`;

    }

    addUserMessage(chatId, finalPrompt);

    const messages =
      getConversation(chatId);

    // ==========================
    // Preparing AI
    // ==========================

    await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: loadingMessageId,
          text: "🧠 Preparing your answer..."
        })
      }
    );

    const groqResponse =
      await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            model:
              "llama-3.3-70b-versatile",
            messages,
            temperature: 0.7
          })
        }
      );    if (!groqResponse.ok) {
      throw new Error(`Groq API Error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();

    let reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    // ==========================
    // Statistics
    // ==========================

    addMessage();

    // ==========================
    // Save Conversation
    // ==========================

    addAssistantMessage(chatId, reply);

    // ==========================
    // Replace "Thinking..."
    // ==========================

    await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: loadingMessageId,
          text: reply
        })
      }
    );

    return res.sendStatus(200);

  } catch (error) {

    console.error("ERROR:", error);

    const chatId =
      req.body?.message?.chat?.id;

    if (chatId) {

      await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text:
              "❌ Sorry, something went wrong while processing your request. Please try again."
          })
        }
      ).catch(() => {});

    }

   return res.sendStatus(200);

  }

});

const PORT =
  process.env.PORT || 8080;

app.listen(PORT, () => {

  console.log(
    `🚀 AyoXpert is running on port ${PORT}`
  );

});

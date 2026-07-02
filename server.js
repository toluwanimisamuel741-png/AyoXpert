const express = require("express");
const { searchWeb } = require("./search");

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
// Questions that usually need live internet information
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

const needsSearch = searchKeywords.some(keyword =>
  userText.toLowerCase().includes(keyword)
);

let searchContext = "";

if (needsSearch) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendChatAction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      action: "typing"
    })
  });

  searchContext = await searchWeb(userText);
}

if (userText === "/start") {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text:
`👋 Welcome to AyoXpert!

I'm your intelligent AI assistant created by Omoniyi Taofeek.

I can help you with:

💻 Programming
📚 School assignments
📈 Business
📱 Digital Marketing
🎬 Animation
📝 Writing
🧮 Mathematics
🌍 General Knowledge
💡 Problem Solving

Type /help to see all available commands.`
    })
  });

  return res.sendStatus(200);
}

if (userText === "/help") {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text:
`📖 AyoXpert Commands

/start - Welcome message
/help - Show commands
/about - About AyoXpert
/creator - Meet the creator
/reset - Clear conversation
/joke - Tell a joke
/quote - Inspirational quote
/motivate - Motivation

Or simply ask me any question naturally.`
    })
  });

  return res.sendStatus(200);
}

if (userText === "/about") {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text:
`🤖 About AyoXpert

AyoXpert is an intelligent AI assistant designed to answer questions, solve problems, explain concepts, assist with programming, digital marketing, business, writing, mathematics, animation, and much more.

Version: 1.0`
    })
  });

  return res.sendStatus(200);
}

if (userText === "/creator") {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text:
`👨‍💻 Creator

AyoXpert was created by Omoniyi Taofeek.

Thank you for using AyoXpert! ❤️`
    })
  });

  return res.sendStatus(200);
}

if (userText === "/joke") {

const jokes = [
"😂 Why don't programmers like nature? It has too many bugs.",
"😂 Why did the computer get cold? It forgot to close Windows.",
"😂 Why do Java developers wear glasses? Because they don't C#.",
"😂 Why was the math book sad? It had too many problems."
];

const joke = jokes[Math.floor(Math.random()*jokes.length)];

await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
chat_id:chatId,
text:joke
})
});

return res.sendStatus(200);
}

if (userText === "/quote") {

const quotes = [
"Success is the sum of small efforts repeated every day.",
"Dream big. Start small. Act now.",
"Believe in yourself and never stop learning.",
"Discipline beats motivation."
];

const quote = quotes[Math.floor(Math.random()*quotes.length)];

await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
chat_id:chatId,
text:quote
})
});

return res.sendStatus(200);
}

if (userText === "/motivate") {

await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
chat_id:chatId,
text:"🔥 Keep going! Every expert was once a beginner. Stay consistent, keep learning, and you'll build amazing things."
})
});

return res.sendStatus(200);
}
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
  content: needsSearch
    ? `User Question: ${userText}

Live Search Results:
${searchContext}`
    : userText
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

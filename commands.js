async function sendMessage(BOT_TOKEN, chatId, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  body: JSON.stringify({
  chat_id: chatId,
  text: text,
  parse_mode: "Markdown"
})
  });
}

async function handleCommand(BOT_TOKEN, chatId, userText, resetConversation) {

  switch (userText.toLowerCase()) {

    case "/start":
      await sendMessage(
        BOT_TOKEN,
        chatId,
`👋 Welcome to AyoXpert!

I'm your intelligent AI assistant.

I can help you with:

💻 Programming
📚 School Assignments
📈 Business
📱 Digital Marketing
🎬 Animation
📝 Writing
🧮 Mathematics
🌍 General Knowledge
💡 Problem Solving

Type /help to see all commands.`
      );
      return true;

    case "/help":
      await sendMessage(
        BOT_TOKEN,
        chatId,
`📖 Commands

/start
/help
/about
/creator
/reset
/joke
/quote
/motivate`
      );
      return true;

    case "/about":
      await sendMessage(
        BOT_TOKEN,
        chatId,
`🤖 AyoXpert

Version 1.0

A professional AI assistant that helps with programming, business, marketing, school work, writing, technology and much more.`
      );
      return true;

    case "/creator":
      await sendMessage(
        BOT_TOKEN,
        chatId,
`👨‍💻 Creator

AyoXpert was created by Omoniyi Taofeek ❤️`
      );
      return true;

    case "/reset":
      resetConversation(chatId);

      await sendMessage(
        BOT_TOKEN,
        chatId,
"✅ Conversation memory has been cleared."
      );
      return true;

    case "/motivate":

      const motivation = [
        "🔥 Never give up. Every expert started as a beginner.",
        "💪 Success comes from consistency.",
        "🚀 Keep learning. Your future self will thank you.",
        "⭐ Small progress every day leads to big success."
      ];

      await sendMessage(
        BOT_TOKEN,
        chatId,
        motivation[Math.floor(Math.random() * motivation.length)]
      );
      return true;

    case "/quote":

      const quotes = [
        "Success is the sum of small efforts repeated every day.",
        "Dream big. Start small. Act now.",
        "Believe in yourself and never stop learning.",
        "Discipline beats motivation."
      ];

      await sendMessage(
        BOT_TOKEN,
        chatId,
        quotes[Math.floor(Math.random() * quotes.length)]
      );
      return true;

    case "/joke":

      const jokes = [
        "😂 Why don't programmers like nature? It has too many bugs.",
        "😂 Why did the computer get cold? It forgot to close Windows.",
        "😂 Why do Java developers wear glasses? Because they don't C#.",
        "😂 Why was the math book sad? It had too many problems."
      ];

      await sendMessage(
        BOT_TOKEN,
        chatId,
        jokes[Math.floor(Math.random() * jokes.length)]
      );
      return true;

    default:
      return false;
  }
}

module.exports = {
  handleCommand
};

async function handlePdf(BOT_TOKEN, chatId) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text:
`📄 PDF received successfully!

This feature is currently being upgraded.

Soon I'll be able to:

✅ Read PDFs
✅ Summarize PDFs
✅ Answer questions from PDFs
✅ Extract important points

Stay tuned 🚀`
    })
  });

  return true;
}

module.exports = {
  handlePdf
};

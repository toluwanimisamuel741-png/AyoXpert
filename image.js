async function handleImage(BOT_TOKEN, chatId) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text:
`🖼️ Image received!

Image AI is currently under construction.

Very soon I'll be able to:

✅ Describe images
✅ Read text from images (OCR)
✅ Solve homework from photos
✅ Explain screenshots
✅ Analyze charts
✅ Identify objects

Stay tuned 🚀`
    })
  });
}

module.exports = {
  handleImage
};

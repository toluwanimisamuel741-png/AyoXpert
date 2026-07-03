const fs = require("fs-extra");
const pdfParse = require("pdf-parse");

async function handlePdf(BOT_TOKEN, chatId, document) {
  try {
    // Tell the user we're working
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: "📄 PDF received.\n\nDownloading and reading your PDF..."
      })
    });

    // We will add the download code next
    console.log("Telegram File ID:", document.file_id);

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text:
`✅ Great!

File ID received successfully.

Filename:
${document.file_name}

Size:
${Math.round(document.file_size / 1024)} KB

Next step:
Downloading the PDF... 🚀`
      })
    });

  } catch (err) {
    console.error(err);

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: "❌ Failed to process the PDF."
      })
    });
  }
}

module.exports = {
  handlePdf
};

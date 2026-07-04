const { saveDocument } = require("./documents");
const axios = require("axios");
const fs = require("fs-extra");
const pdfParse = require("pdf-parse");

async function handlePdf(BOT_TOKEN, chatId, document) {
  try {
    // Tell user we're working
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: "📄 Downloading your PDF..."
      })
    });

    // Step 1: Get file path from Telegram
    const fileResponse = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${document.file_id}`
    );

    const filePath = fileResponse.data.result.file_path;

    // Step 2: Download file
    const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    const pdfBuffer = (
      await axios.get(url, {
        responseType: "arraybuffer"
      })
    ).data;

    // Step 3: Save temporarily
    await fs.writeFile("temp.pdf", pdfBuffer);

    // Step 4: Read PDF
    const data = await pdfParse(pdfBuffer);
saveDocument(chatId, data.text);
    const { addPdf } = require("./stats");

addPdf();
    // Step 5: Delete temporary file
    await fs.remove("temp.pdf");

    // Step 6: Reply with first part of the text
await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    chat_id: chatId,
    text:
`✅ PDF loaded successfully!

📄 Pages: ${data.numpages}

I've finished reading your document.

You can now ask me things like:

• Summarize this PDF
• Explain Chapter 2
• List important points
• Generate quiz questions
• Translate parts of the document`
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
        text: "❌ I couldn't read this PDF."
      })
    });
  }
}

module.exports = {
  handlePdf
};

const axios = require("axios");

async function handleImage(BOT_TOKEN, chatId, photo) {

  try {

    // Tell the user we're working
    await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🖼️ Downloading your image..."
        })
      }
    );

    // Get the highest-quality image
    const fileId = photo[photo.length - 1].file_id;

    // Ask Telegram where the file is stored
    const fileInfo = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile`,
      {
        params: {
          file_id: fileId
        }
      }
    );

    const filePath = fileInfo.data.result.file_path;

    // Build the download URL
    const imageUrl =
      `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    // Download the image
    const imageResponse = await axios.get(
      imageUrl,
      {
        responseType: "arraybuffer"
      }
    );

    const imageBuffer = Buffer.from(imageResponse.data);

    // For now, just confirm success
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
`✅ Image downloaded successfully!

Size: ${Math.round(imageBuffer.length / 1024)} KB

Ready for AI analysis...`
        })
      }
    );

  } catch (err) {

    console.error(err);

    await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: "❌ I couldn't download that image."
        })
      }
    );

  }

}

module.exports = {
  handleImage
};

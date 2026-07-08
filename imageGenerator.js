const fetch = require("node-fetch");

async function generateImage(prompt) {

    const imageUrl =
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    return imageUrl;

}

module.exports = {
    generateImage
};

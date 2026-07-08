async function generateImage(prompt) {

    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

}

module.exports = {
    generateImage
};

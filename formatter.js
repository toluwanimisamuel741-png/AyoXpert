function formatReply(text) {

    if (!text) return "";

    // Remove Windows line endings
    text = text.replace(/\r/g, "");

    // Replace triple backticks with single backticks
    text = text.replace(/```/g, "`");

    // Prevent huge empty spaces
    text = text.replace(/\n{3,}/g, "\n\n");

    // Trim spaces
    text = text.trim();

    return text;

}

module.exports = {
    formatReply
};

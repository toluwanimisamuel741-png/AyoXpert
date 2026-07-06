function splitMessage(text, maxLength = 4000) {

    const parts = [];

    while (text.length > maxLength) {

        let slice = text.substring(0, maxLength);

        const lastNewline = slice.lastIndexOf("\n");

        if (lastNewline > 0) {
            slice = slice.substring(0, lastNewline);
        }

        parts.push(slice);

        text = text.substring(slice.length);

    }

    parts.push(text);

    return parts;

}

module.exports = {
    splitMessage
};

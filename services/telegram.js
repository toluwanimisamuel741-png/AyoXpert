async function sendTelegramMessage(botToken, chatId, text) {

    return fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: "Markdown"
            })
        }
    );

}

async function editTelegramMessage(botToken, chatId, messageId, text) {

    return fetch(
        `https://api.telegram.org/bot${botToken}/editMessageText`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                text,
                parse_mode: "Markdown"
            })
        }
    );

}

module.exports = {
    sendTelegramMessage,
    editTelegramMessage
};

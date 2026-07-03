const documents = {};

function saveDocument(chatId, text) {
  documents[chatId] = text;
}

function getDocument(chatId) {
  return documents[chatId];
}

module.exports = {
  saveDocument,
  getDocument
};

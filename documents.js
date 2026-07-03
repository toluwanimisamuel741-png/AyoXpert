const documents = {};

function saveDocument(chatId, text) {
  documents[chatId] = text;
}

function getDocument(chatId) {
  return documents[chatId] || null;
}

function deleteDocument(chatId) {
  delete documents[chatId];
}

module.exports = {
  saveDocument,
  getDocument,
  deleteDocument
};

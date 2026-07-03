// Stores the latest document for each user

const documents = {};

// Save document text
function saveDocument(chatId, text) {
  documents[chatId] = text;
}

// Get document text
function getDocument(chatId) {
  return documents[chatId] || null;
}

// Remove document
function clearDocument(chatId) {
  delete documents[chatId];
}

module.exports = {
  saveDocument,
  getDocument,
  clearDocument
};

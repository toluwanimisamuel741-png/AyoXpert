const stats = {
  users: new Set(),
  messages: 0,
  pdfs: 0,
  searches: 0,
  startedAt: Date.now()
};

function addUser(chatId) {
  stats.users.add(chatId);
}

function addMessage() {
  stats.messages++;
}

function addPdf() {
  stats.pdfs++;
}

function addSearch() {
  stats.searches++;
}

function getStats() {
  return {
    users: stats.users.size,
    messages: stats.messages,
    pdfs: stats.pdfs,
    searches: stats.searches,
    uptime: Date.now() - stats.startedAt
  };
}

module.exports = {
  addUser,
  addMessage,
  addPdf,
  addSearch,
  getStats
};

const stats = {
  messages: 0,
  pdfs: 0,
  searches: 0
};

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
  return stats;
}

module.exports = {
  addMessage,
  addPdf,
  addSearch,
  getStats
};

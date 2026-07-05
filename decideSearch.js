async function shouldSearch(userText) {

  const keywords = [
    "today",
    "latest",
    "news",
    "current",
    "weather",
    "price",
    "bitcoin",
    "crypto",
    "stock",
    "football",
    "soccer",
    "score",
    "match",
    "breaking",
    "update"
  ];

  return keywords.some(keyword =>
    userText.toLowerCase().includes(keyword)
  );

}

module.exports = {
  shouldSearch
};

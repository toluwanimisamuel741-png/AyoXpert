const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

async function searchWeb(query) {
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        search_depth: "basic",
        max_results: 5
      })
    });

    const data = await response.json();

    if (!data.results) {
      return "No search results found.";
    }

    return data.results
      .map(result => `${result.title}\n${result.content}`)
      .join("\n\n");

  } catch (err) {
    console.error(err);
    return "Search failed.";
  }
}

module.exports = {
  searchWeb
};

async function shouldSearch(userText) {

    const text = userText.toLowerCase();

    const keywords = [

        // Time
        "today",
        "yesterday",
        "tomorrow",
        "latest",
        "current",
        "currently",
        "now",
        "recent",
        "breaking",
        "update",
        "updates",
        "live",

        // News
        "news",
        "headline",
        "headlines",

        // Weather
        "weather",
        "forecast",
        "temperature",
        "rain",

        // Finance
        "price",
        "prices",
        "stock",
        "stocks",
        "market",
        "bitcoin",
        "crypto",
        "ethereum",
        "gold",
        "dollar",
        "usd",
        "exchange rate",

        // Sports
        "football",
        "soccer",
        "match",
        "matches",
        "score",
        "scores",
        "premier league",
        "laliga",
        "champions league",
        "nba",
        "fifa",

        // Politics
        "president",
        "election",
        "government",
        "minister",

        // Technology
        "openai",
        "chatgpt",
        "google",
        "apple",
        "microsoft",
        "tesla",
        "iphone",
        "android",

        // Generic search words
        "search",
        "look up",
        "find",
        "who is",
        "what is",
        "where is",
        "when is"

    ];

    return keywords.some(keyword => text.includes(keyword));

}

module.exports = {
    shouldSearch
};

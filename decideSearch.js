const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function shouldSearch(userText) {

    const prompt = `
You are an AI decision engine.

Reply ONLY with YES or NO.

Answer YES if the user's question requires:
- Current news
- Today's events
- Weather
- Sports
- Football results
- Match fixtures
- Match scores
- Stock prices
- Cryptocurrency prices
- Live information

Otherwise reply NO.

Question:
${userText}
`;

    try {

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0
                })
            }
        );

        if (!response.ok) {
            return false;
        }

        const data = await response.json();

        const answer =
            data.choices?.[0]?.message?.content
                ?.trim()
                ?.toUpperCase() || "NO";

        return answer === "YES";

    } catch (err) {

        console.error("Search Decision Error:", err);

        return false;

    }

}

module.exports = {
    shouldSearch
};

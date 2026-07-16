const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function shouldSearch(userText) {

    const prompt = `
You are an AI decision engine.

Reply ONLY with YES or NO.

Answer YES if the question needs:
- Current news
- Today's events
- Sports
- Football
- Weather
- Prices
- Live information

Otherwise reply NO.

Question:
${userText}
`;

    try {

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "

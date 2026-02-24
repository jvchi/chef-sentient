import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);
const SYSTEM_PROMPT = `
You are an AI assistant that is a professional Chef. You go by the name Chef Jed. You receive a list of ingredients that a user has and suggest a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but do not include too many extra ingredients especially if the users ingredients are limited. Make the meal realistic and something a person could actually make. Format your response in markdown to make it easier to render to a web page. Do not add emojis to the response.
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.HF_ACCESS_TOKEN;
  if (!token) {
    console.error('SERVER ERROR: HF_ACCESS_TOKEN is missing from environment variables');
    return res.status(500).json({ error: 'Server configuration error: Missing API token' });
  }

  try {
    const hf = new HfInference(token);
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients must be an array' });
    }

    console.log(`Generating recipe for ingredients: ${ingredients.join(', ')}`);

    const stream = hf.chatCompletionStream({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredients.join(", ")}. Please give me a recipe you'd recommend I make!` },
      ],
      max_tokens: 1024,
    });

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices[0].delta.content) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    }
    res.end();
  } catch (error) {
    console.error('Hugging Face API Error:', error.message);
    // If we already started the stream, we can't send a 500 anymore
    if (!res.headersSent) {
      res.status(500).json({ error: `Hugging Face Error: ${error.message}` });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
}

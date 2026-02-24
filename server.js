import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { HfInference } from "@huggingface/inference";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

const SYSTEM_PROMPT = `
You are an AI assistant that is a professional Chef. You go by the name Chef Jed. You receive a list of ingredients that a user has and suggest a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but do not include too many extra ingredients especially if the users ingredients are limited. Make the meal realistic and something a person could actually make. Format your response in markdown to make it easier to render to a web page. Do not add emojis to the response.
`;

app.post('/api/recipe', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients must be an array' });
    }

    const ingredientsString = ingredients.join(", ");

    // Use streaming for better UX
    const stream = hf.chatCompletionStream({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
      ],
      max_tokens: 1024,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices[0].delta.content) {
        // Formatting as SSE data
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    }
    res.end();
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

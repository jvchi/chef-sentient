import { HfInference } from "@huggingface/inference";

// This tells Vercel to run this as an Edge Function (better for streaming)
export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `
You are an AI assistant that is a professional Chef. You go by the name Chef Jed. You receive a list of ingredients that a user has and suggest a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but do not include too many extra ingredients especially if the users ingredients are limited. Make the meal realistic and something a person could actually make. Format your response in markdown to make it easier to render to a web page. Do not add emojis to the response.
`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const token = process.env.HF_ACCESS_TOKEN;
  if (!token) {
    console.error('SERVER ERROR: HF_ACCESS_TOKEN is missing');
    return new Response(JSON.stringify({ error: 'Missing HF_ACCESS_TOKEN in Vercel Settings' }), { status: 500 });
  }

  try {
    const { ingredients } = await req.json();
    if (!ingredients || !Array.isArray(ingredients)) {
      return new Response(JSON.stringify({ error: 'Ingredients must be an array' }), { status: 400 });
    }

    const hf = new HfInference(token);

    const stream = hf.chatCompletionStream({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredients.join(", ")}. Please give me a recipe you'd recommend I make!` },
      ],
      max_tokens: 1024,
    });

    // Create a ReadableStream for the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.choices && chunk.choices[0].delta.content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
            }
          }
        } catch (e) {
          console.error('Stream error:', e);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

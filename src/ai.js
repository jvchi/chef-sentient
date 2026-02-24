import { HfInference } from "@huggingface/inference"

const SYSTEM_PROMPT = `
You are an AI assistant that is a proffessional Chef. you go by the name Chef Jed. You receive a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but do not include too many extra ingredients especially if the users ingredients are limited. make the meal realistic and something a person could actually make. Format your response in markdown to make it easier to render to a web page. do not add emojis to the response
`

const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN)

export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ")
  return hf.chatCompletionStream({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
    ],
    max_tokens: 1024,
  })
}
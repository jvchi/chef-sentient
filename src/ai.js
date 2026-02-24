import { GoogleGenerativeAI } from "@google/generative-ai"

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
console.log("Token:", import.meta.env.VITE_GEMINI_API_KEY)


export async function getRecipeFromGemini(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ")
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })
    const result = await model.generateContent(
      `${SYSTEM_PROMPT}\n\nI have ${ingredientsString}. Please give me a recipe you'd recommend I make!`
    )
    return result.response.text()
  } catch (err) {
    console.error(err)
    return "Sorry, couldn't fetch a recipe. Please try again."
  }
}
import { useState } from 'react'
import Button from './Button'
import Recipe from './Recipe'
import IngredientsList from './ingredientsList'
import { getRecipeFromMistral } from '../ai'



export default function Main() {

  const [isIngredients, setIsIngredient] = useState([])
  const [recipeShown, setShowRecipe] = useState(false);
  const [recipe, setRecipe] = useState('')
  const [isActive, setIsActive] = useState(false)

  async function showRecipe() {
    setRecipe('')
    setShowRecipe(true);
    let hasStartedStreaming = false;

    try {
      const stream = await getRecipeFromMistral(isIngredients)
      for await (const chunk of stream) {
        if (chunk.choices && chunk.choices[0].delta.content) {
          hasStartedStreaming = true;
          const newText = chunk.choices[0].delta.content
          setRecipe(prev => prev + newText)
        }
      }
    } catch (err) {
      console.error(err);
      if (!hasStartedStreaming) {
        setRecipe("Sorry, Chef Jed is currently cooking. Please try again later.");
      }
    }
  }

  function signUp(formData) {
    const newIngredient = formData.get('ingredient')
    if (newIngredient && newIngredient.trim().length > 0) {
      setIsIngredient(prevIngredients => [...prevIngredients, newIngredient.trim()]);
    }
  }


  return (
    <>
      <main className="pt-14 sm:pt-24">
        <form
          onFocus={() => setIsActive(true)}
          action={signUp}
          className={`flex mx-auto grow border-neutral-200 [&>*]:p-2 [&>*]:rounded-full rounded-full min-h-[38px] items-stretch max-w-[800px] select-none transition-all duration-700 ease-in-out ${isActive || isIngredients.length > 0 ? 'translate-y-0' : 'translate-y-64 sm:translate-y-80'}`}
        >

          <input type="text"
            name='ingredient'
            aria-label="add ingredients"
            placeholder="e.g garri..."
            className=" placeholder-neutral-200 mx-2 flex-1 shadow-[0px_0px_5px_rgba(0,0,0,0.5)] ring-black/5 ring shadow-neutral-200 focus:outline-2 outline-black/5  transition-all duration-100 bg-neutral-50 text-[12px] sm:text-[16px]"
          />

          <Button type="submit">Add Ingredient</Button>
        </form>
      </main>

      {isIngredients.length ? <IngredientsList isIngredients={isIngredients} showRecipe={showRecipe} /> : null}
      {recipeShown && <Recipe recipe={recipe} />}
    </>
  )
}


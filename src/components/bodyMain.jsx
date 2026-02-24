import { useState } from 'react'
import Button from './Button'
import Recipe from './Recipe'
import IngredientsList from './ingredientsList'
import { getRecipeFromMistral } from '../ai'



export default function Main() {

  const [isIngredients, setIsIngredient] = useState([])
  const [recipeShown, setShowRecipe] = useState(false);
  const [recipe, setRecipe] = useState('')

  async function showRecipe() {
    console.log('loading recipe...')

    const generatedRecipe = await getRecipeFromMistral(isIngredients)
    setShowRecipe(true)
    setRecipe(generatedRecipe)

    console.log(generatedRecipe)
  }

  function signUp(formData) {
    const newIngredient = formData.get('ingredient')
    { newIngredient.length && setIsIngredient(prevIngredients => [...prevIngredients, newIngredient]) }
  }


  return (
    <>
      <main className="pt-14 sm:pt-24">
        <form action={signUp} className="flex mx-auto grow border-neutral-200 [&>*]:p-2 [&>*]:border-[0.5px] [&>*]:rounded-2xl rounded-2xl max-h-[45px] items-stretch max-w-[800px] select-none">

          <input type="text"
            name='ingredient'
            aria-label="add ingredients"
            placeholder="e.g garri..."
            className=" placeholder-neutral-200 mx-2 flex-1 focus:shadow-inner focus:border-[1px] transition-all duration-200 border-neutral-300 bg-neutral-50 text-[12px] sm:text-[16px]"
          />

          <Button type="submit">Add Ingredient</Button>
        </form>
      </main>

      {isIngredients.length ? <IngredientsList isIngredients={isIngredients} showRecipe={showRecipe} /> : null}
      {recipeShown && <Recipe recipe={recipe} />}
    </>
  )
}


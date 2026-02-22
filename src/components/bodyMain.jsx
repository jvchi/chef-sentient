import { useState } from 'react'
import Button from './Button'



export default function Main(){

  const [isIngredients, setIsIngredient] = useState([])
  const list = isIngredients.map((ingredient) =>{
    return <li key={ingredient} className='text-[14px] sm:text-[16px] font-light list-disc mx-8 text-[#475467]'>{ingredient}</li>
  })

  function signUp(formData){
    const newIngredient = formData.get('ingredient')
    {newIngredient.length && setIsIngredient(prevIngredients => [...prevIngredients, newIngredient])}
  }

  const [recipeShown, setShowRecipe] = useState(false);

  function showRecipe(){
    setShowRecipe(prevRecipe => !prevRecipe)
    console.log('beans')
  }


  return(
    <>
      <main className="pt-24 px-4">
        <form action={signUp} className="flex mx-auto grow border-neutral-200 [&>*]:p-2 [&>*]:border-[0.5px] [&>*]:rounded-2xl rounded-2xl max-h-[38px] items-stretch max-w-[800px] select-none">

        <input type="text"
        name='ingredient'
        aria-label="add ingredients"
        placeholder="e.g garri..."
        className=" placeholder-neutral-200 mx-2 flex-1 focus:shadow-inner focus:border-[1px] transition-all duration-200 border-neutral-300 bg-neutral-50"
        />

        <Button  type="submit">Add Ingredient</Button>
        </form>
      </main>

      {isIngredients.length ? <section className=' max-w-[800px] flex flex-col justify-around mx-auto  grow my-2 h-max px-4'>
        <h1 className='text-[16px] font-medium my-4 sm:text-[22px]'>Ingredients on hand:</h1>

        <ul className="">
         {list}
        </ul>

        {isIngredients.length >= 4 && <div className='flex flew-row justify-center items-center bg-[#F0EFEB] h-[100px] max-w-[500px] my-8 px-4'>
          <div className='w-[300px] h-[52px] flex flex-col items-center justify-center'>
            <h4 className='text-[13px] sm:text-[16px] font-medium'>Ready for a recipe?</h4>
            <p className='text-[8px] sm:text-[12px] font-light text-[#6B7280]'>Generate a recipe from your list of ingredients.</p>
          </div>
          <Button variant='secondary' onClick={showRecipe}>Get a recipe</Button>
        </div>}
      </section> : null}
      {recipeShown && <section className='h-max flex flex-col items-center text-center'>
          <h2>Chef Claude Recommends:</h2>
          <article className="suggested-recipe-container" aria-live="polite">
              <p>Based on the ingredients you have available, I would recommend making a simple a delicious <strong>Beef Bolognese Pasta</strong>. Here is the recipe:</p>
              <h3>Beef Bolognese Pasta</h3>
              <strong>Ingredients:</strong>
              <ul>
                  <li>1 lb. ground beef</li>
                  <li>1 onion, diced</li>
                  <li>3 cloves garlic, minced</li>
                  <li>2 tablespoons tomato paste</li>
                  <li>1 (28 oz) can crushed tomatoes</li>
                  <li>1 cup beef broth</li>
                  <li>1 teaspoon dried oregano</li>
                  <li>1 teaspoon dried basil</li>
                  <li>Salt and pepper to taste</li>
                  <li>8 oz pasta of your choice (e.g., spaghetti, penne, or linguine)</li>
              </ul>
              <strong>Instructions:</strong>
              <ol>
                  <li>Bring a large pot of salted water to a boil for the pasta.</li>
                  <li>In a large skillet or Dutch oven, cook the ground beef over medium-high heat, breaking it up with a wooden spoon, until browned and cooked through, about 5-7 minutes.</li>
                  <li>Add the diced onion and minced garlic to the skillet and cook for 2-3 minutes, until the onion is translucent.</li>
                  <li>Stir in the tomato paste and cook for 1 minute.</li>
                  <li>Add the crushed tomatoes, beef broth, oregano, and basil. Season with salt and pepper to taste.</li>
                  <li>Reduce the heat to low and let the sauce simmer for 15-20 minutes, stirring occasionally, to allow the flavors to meld.</li>
                  <li>While the sauce is simmering, cook the pasta according to the package instructions. Drain the pasta and return it to the pot.</li>
                  <li>Add the Bolognese sauce to the cooked pasta and toss to combine.</li>
                  <li>Serve hot, garnished with additional fresh basil or grated Parmesan cheese if desired.</li>
              </ol>
          </article>
      </section>}
    </>
  )
}


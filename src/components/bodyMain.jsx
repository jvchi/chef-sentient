import { useState } from 'react'
import Button from './Button'



export default function Main(){

  const [isIngredients, setIsIngredient] = useState([])
  const list = isIngredients.map((ingredient) =>{
    return <li key={ingredient} className='text-[14px] sm:text-[16px] font-light list-disc mx-4'>{ingredient}</li>
  })

  function signUp(formData){
    const newIngredient = formData.get('ingredient')
    {newIngredient.length && setIsIngredient(prevIngredients => [...prevIngredients, newIngredient])}
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

      {isIngredients.length ? <section className='max-w-[800px] min-h-[200px] flex flex-col justify-around mx-auto  grow my-2 h-max px-8'>
        <h1 className='text-[16px] font-medium my-4 sm:text-[22px]'>Ingredients on hand:</h1>

        <ul className="">
         {list}
        </ul>

        <div className='flex flew-row justify-center items-center bg-[#F0EFEB] h-[100px] max-w-[500px] my-8 px-4'>
          <div className='w-[300px] h-[52px] flex flex-col items-center justify-center'>
            <h4 className='text-[13px] sm:text-[16px] font-medium'>Ready for a recipe?</h4>
            <p className='text-[10px] sm:text-[13] font-light text-[#6B7280]'>Generate a recipe from your list of ingredients.</p>
          </div>
          <Button variant='secondary'>Get a recipe</Button>
        </div>
      </section> : null}
    </>
  )
}


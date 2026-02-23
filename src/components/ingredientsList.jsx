import Button from "./Button"

export default function ingredientsList(props){

  const list = props.isIngredients.map((ingredient) =>{
    return <li key={ingredient} className='text-[14px] sm:text-[16px] font-light list-disc mx-8 text-[#475467]'>{ingredient}</li>
  })

  return(

    <section className=' max-w-[800px] flex flex-col justify-around mx-auto  grow my-2 h-max px-4'>
        <h1 className='text-[16px] font-medium my-4 sm:text-[22px]'>Ingredients on hand:</h1>

        <ul className="">
         {list}
        </ul>

        {props.isIngredients.length >= 4 && <div className='flex flew-row justify-center items-center bg-[#F0EFEB] h-[100px] max-w-[500px] my-8 px-4'>
          <div className='w-[300px] h-[52px] flex flex-col items-center justify-center'>
            <h4 className='text-[13px] sm:text-[16px] font-medium'>Ready for a recipe?</h4>
            <p className='text-[8px] sm:text-[12px] font-light text-[#6B7280]'>Generate a recipe from your list of ingredients.</p>
          </div>
          <Button variant='secondary' onClick={props.showRecipe}>Get a recipe</Button>
        </div>}
      </section>
  )
}

export default function Main(){

  const ingredients = ['Eba', 'garri', 'groundnut']
  const list = ingredients.map((ingredient) =>{
    return <li key={ingredient}>{ingredient}</li>
  })


  function handleSubmit(e){
    e.preventDefault();
    console.log('form submitted!')
    const formData = new FormData(e.currentTarget)
    const newIngredient = formData.get('ingredient')
    ingredients.push(newIngredient);
    console.log(ingredients)

    e.currentTarget.reset() //resets the input
  }


  return(
    <main className="py-24 px-12">
      <form 
      onSubmit={handleSubmit} className="flex mx-auto grow border-neutral-200 [&>*]:p-2 [&>*]:border [&>*]:rounded-2xl rounded-2xl min-h-[38px] items-stretch max-w-[800px] select-none">

      <input type="text"
      name='ingredient'
      aria-label="add ingredients"
      placeholder="e.g garri..."
      className=" placeholder-neutral-200 mx-2 flex-1 focus:shadow-inner transition-all duration-200 border-neutral-300 bg-neutral-50"
      />

      <button  type="submit" className="bg-neutral-900 text-neutral-50 text-[14px] shadow-[inset_0px_0px_3px_rgba(0,0,0,0.5)] shadow-white ">Add Ingredients</button>
    </form>

    <ul className="mx-auto max-w-[800px] grow my-8 h-[366px] px-4 ">
      {list}
    </ul>

    </main>
  )
}


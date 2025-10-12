import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Main(){
  const ingredients = ["Chicken", "Oregano", "Tomatoes"];

  const ingredientListItem = ingredients.map(ingredient=>(
    <li>{ingredient}</li> 
  ))

  function handleSubmit(e){
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newIngredient = formData.get('ingredient');
    ingredients.push(newIngredient)
    console.log(ingredients)
  }

  return(
    <main>
      <form className="add-ingredient-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="e.g. ofe egusi" aria-label="add ingredient"
        name='ingredient'
        className='input'/>
        <button type="submit">Add ingredient 
        </button>
      </form>
      <ul>
        {ingredientListItem}
      </ul>
    </main>
  )
}
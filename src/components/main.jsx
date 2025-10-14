import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {useState} from "react"

export default function Main(){
  const [ingredients, setIngredients] = useState(["Chicken", "Oregano", "Tomatoes"]);

  const ingredientListItem = ingredients.map((ingredient, index) => (
    <li key={index}>
      {ingredient}
      <FontAwesomeIcon
        icon={faTrash}
        className="delete"
        onClick={() =>
          setIngredients(prev => prev.filter((_, i) => i !== index))
        }
      />
    </li>
  ));
  const [newIngredient, setNewIngredient] = useState("")

  function handleSubmit(e){
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let newIngredient = formData.get('ingredient');

    if(!newIngredient.length) return;
    
    setIngredients(prevIngredient => [...prevIngredient, newIngredient])

    setNewIngredient("")

  }

  return(
    <main>
      <form className="add-ingredient-form" onSubmit={handleSubmit}>
        <input type="text" 
        placeholder="e.g. ofe egusi" aria-label="add ingredient"
        name='ingredient'
        value={newIngredient}
        onChange={(event) => setNewIngredient(event.target.value)}
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
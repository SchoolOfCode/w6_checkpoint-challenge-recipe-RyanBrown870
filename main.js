import { APP_ID, APP_KEY } from './config/dev.js';

let foodToSearch = null;
let button = document.querySelector('#recipe-button');
button.addEventListener('click', handleRecipeClick);
let input = document.querySelector('#food-input');
input.addEventListener('change', handleFoodChange);

async function handleRecipeClick() {
  const recipe = await fetchRecipe(foodToSearch);
  const {
    recipe: { label },
    recipe: { url },
  } = recipe;
  let recipeLink = document.querySelector('#recipe-label');
  recipeLink.innerHTML = label;
  recipeLink.setAttribute('href', url);
}

function handleFoodChange() {
  foodToSearch = document.querySelector('#food-input').value;
}

async function fetchRecipe(food) {
  const requestUrl = `https://api.edamam.com/search?q=${food}&app_id=${APP_ID}&app_key=${APP_KEY}`;
  const response = await fetch(requestUrl);
  const jsonResponse = await response.json();
  const recipe = jsonResponse.hits[0];
  console.log(recipe);
  return recipe;
}
fetchRecipe('potato');

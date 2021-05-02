import { APP_ID, APP_KEY } from './config/dev.js';

let foodToSearch = null;

function handleRecipeClick() {
  fetchRecipe(foodToSearch);
}

function handleFoodChange() {
  foodToSearch = document.querySelector('#food-input').value;
}

async function fetchRecipe(food) {
  const requestUrl = `https://api.edamam.com/search?q=${food}&app_id=${APP_ID}&app_key=${APP_KEY}`;
  const response = await fetch(requestUrl);
  const jsonResponse = await response.json();
  const recipe = jsonResponse.hits[0];
}
fetchRecipe('potato');

import { APP_ID, APP_KEY } from './config/dev.js';

let foodToSearch = null;
let button = document.querySelector('#recipe-button');
button.addEventListener('click', handleSearchClick);
let input = document.querySelector('#food-input');
input.addEventListener('change', handleFoodChange);

async function handleSearchClick() {
  const recipe = await fetchRecipe(foodToSearch);
  buildResultsList(recipe);
}

function handleFoodChange() {
  foodToSearch = document.querySelector('#food-input').value;
}

async function fetchRecipe(food) {
  const requestUrl = `https://api.edamam.com/search?q=${food}&app_id=${APP_ID}&app_key=${APP_KEY}`;
  const response = await fetch(requestUrl);
  const jsonResponse = await response.json();
  const recipe = jsonResponse;
  console.log(recipe);
  return recipe;
}

function buildResultsList(recipes) {
  let displayContainer = document.getElementById('display-container');
  displayContainer.innerHTML = '';
  console.log('build results firing');
  let cardNodeList = recipes.hits.map((recipe) => {
    return buildRecipeCard(recipe);
  });
  cardNodeList.forEach((card) => {
    displayContainer.appendChild(card);
  });
}

function buildRecipeCard(recipe) {
  let card = document.createElement('section');
  card.setAttribute('id', recipe.recipe.label);
  card.className = 'card';

  let title = document.createElement('h2');
  title.innerText = recipe.recipe.label;

  let image = document.createElement('img');
  image.setAttribute('src', recipe.recipe.image);

  let ul = document.createElement('ul');
  let data = [
    recipe.recipe.yield,
    Math.floor(recipe.recipe.calories),
    recipe.recipe.totalTime,
  ];

  let dataNodes = data.map((item, index) => {
    let node = document.createElement('li');
    let textNode = document.createElement('p');
    switch (index) {
      case 0:
        textNode.innerText = `Serves ${item}`;
        break;
      case 1:
        textNode.innerText = `Cals: ${item} kcals`;
        break;
      case 2:
        textNode.innerText = `Cooking time: ${item} minutes`;
        break;
    }
    node.appendChild(textNode);
    return node;
  });

  dataNodes.forEach((node) => {
    ul.appendChild(node);
  });

  let button = document.createElement('a');
  button.innerText = 'See Recipe';
  button.setAttribute('id', recipe.recipe.uri);
  button.className = 'btn';
  button.setAttribute('data-uri', recipe.recipe.uri);
  button.addEventListener('click', displaySingleRecipe);

  card.appendChild(title);
  card.appendChild(image);
  card.appendChild(ul);
  card.appendChild(button);

  return card;
}

function displaySingleRecipe(event) {
  console.log(event);
}

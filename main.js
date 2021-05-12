import { APP_ID, APP_KEY, WEATHER_API_KEY } from './config/dev.js';

const foodOfTheDay = [
  'chicken',
  'beef',
  'pasta',
  'pizza',
  'fish',
  'roast',
  'grill',
  'curry',
  'asian',
  'american',
  'french',
];

let recipes;
let foodToSearch = null;
let button = document.querySelector('#recipe-button');
button.addEventListener('click', handleSearchClick);
let input = document.querySelector('#food-input');
input.addEventListener('change', handleFoodChange);
let weatherRecipeButton = document.querySelector('#weather-recipe');
weatherRecipeButton.addEventListener('click', getWeatherRecipe);

displaySingleRecipe();

async function weatherApi() {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=Birmingham,BIR,GB&appid=${WEATHER_API_KEY}`;
  const response = await fetch(url);
  const jsonResponse = await response.json();
  console.log(jsonResponse);
  return jsonResponse;
}

async function getWeatherRecipe() {
  let weatherData = await weatherApi();
  let weather = weatherData.weather[0].main;
  let temperature = weatherData.main.temp_max - 273;

  let niceWeatherTerms = [
    'bbq',
    'grill',
    'salad',
    'spanish',
    'paella',
    'omellete',
  ];

  let coldWeatherTerms = ['soup', 'roast', 'stew', 'curry', 'tagine'];
  let query;
  // If hot and sunny, bbq, salads, paella
  if (weather == 'Clear' && temperature > 16) {
    query = 'grill';
  } else if (temperature > 16 && weather !== 'Rain') {
    query =
      niceWeatherTerms[Math.floor(Math.random() * niceWeatherTerms.length)];
  } else if (temperature > 16 && weather !== 'Clear') {
    query = 'pizza';
  } else if (temperature < 16 && weather == 'Rain') {
    query = 'soup';
  } else {
    query =
      coldWeatherTerms[Math.floor(Math.random() * coldWeatherTerms.length)];
  }

  recipes = await fetchRecipe(query);
  buildResultsList(recipes);
}

async function handleSearchClick() {
  recipes = await fetchRecipe(foodToSearch);
  buildResultsList(recipes);
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

  let cardNodeList = recipes.hits.map((recipe, index) => {
    return buildRecipeCard(recipe, index);
  });
  cardNodeList.forEach((card) => {
    displayContainer.appendChild(card);
  });
}

function buildRecipeCard(recipe, index) {
  let card = createNewElement('section', '', 'card', recipe.recipe.label);

  let title = createNewElement('h2', recipe.recipe.label);

  let image = createNewElement('img');
  image.setAttribute('src', recipe.recipe.image);

  let ul = createNewElement('ul');

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

  let button = createNewElement('a', 'See Recipe', 'btn', recipe.recipe.uri);
  button.setAttribute('data-index', index);
  button.setAttribute('data-uri', recipe.recipe.uri);
  button.addEventListener('click', displaySingleRecipe);

  card.appendChild(title);
  card.appendChild(image);
  card.appendChild(ul);
  card.appendChild(button);

  return card;
}

function createNewElement(element, text, className, id) {
  let newElement = document.createElement(element);
  if (text) {
    newElement.innerText = text;
  }
  if (className) {
    newElement.className = className;
  }
  if (id) {
    newElement.setAttribute('id', id);
  }
  return newElement;
}

async function displaySingleRecipe(event) {
  let displayContainer = document.querySelector('#display-container');
  displayContainer.innerHTML = '';
  let recipe;
  if (event) {
    recipe = recipes.hits[event.target.dataset.index];
  } else {
    // get random recipe
    let foodOfTheDayTerm =
      foodOfTheDay[Math.floor(Math.random() * foodOfTheDay.length)];
    const requestUrl = `https://api.edamam.com/search?q=${foodOfTheDayTerm}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=30`;
    const response = await fetch(requestUrl);
    const jsonResponse = await response.json();
    recipe =
      jsonResponse.hits[Math.floor(Math.random() * jsonResponse.hits.length)];
  }

  let image = createNewElement('img', '', '');
  image.setAttribute('src', recipe.recipe.image);
  let summaryContainer = createNewElement(
    'section',
    '',
    'summary-container__information'
  );
  let title = createNewElement(
    'h2',
    recipe.recipe.label,
    'single-recipe-title'
  );
  let ul = createNewElement('ul', '', 'recipe-summary');
  let servings = createNewElement(
    'li',
    `Serves ${recipe.recipe.yield}`,
    'recipe-summary__item'
  );
  let calories = createNewElement(
    'li',
    `${recipe.recipe.calories.toFixed(1)} kcals`,
    'recipe-summary__item'
  );

  let time = createNewElement(
    'li',
    `${recipe.recipe.totalTime} minutes`,
    'recipe-summary__item'
  );

  let source = createNewElement(
    'li',
    `Source ${recipe.recipe.source}`,
    'recipe-summary__item'
  );

  let dietLabelText = recipe.recipe.dietLabels.join(', ');
  let dietLabels = createNewElement(
    'li',
    dietLabelText,
    'recipe-summary__item'
  );

  let mealType = createNewElement(
    'li',
    `Meal: ${recipe.recipe.mealType}`,
    'recipe-summary__item'
  );

  ul.appendChild(servings);
  ul.appendChild(calories);
  ul.appendChild(time);
  ul.appendChild(source);
  ul.appendChild(dietLabels);
  ul.appendChild(mealType);

  let nutritionSection = createNewElement('section', '', 'nutrition');
  let nutritionTitle = createNewElement('h2', 'Nutrition', 'nutrition__title');

  let nutritionUl = createNewElement('ul', '', 'nutrition__ul');
  let fat = createNewElement('li', '', 'nutrition__ul__item');
  let pFat = createNewElement('p', `Fat`, 'nutrition__ul__item__text');
  let pFatQuantity = createNewElement(
    'p',
    `${recipe.recipe.totalNutrients.FAT.quantity.toFixed(1)} ${
      recipe.recipe.totalNutrients.FAT.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  fat.appendChild(pFat);
  fat.appendChild(pFatQuantity);

  let carbs = createNewElement('li', '', 'nutrition__ul__item');
  let pCarb = createNewElement('p', `Carbs`, 'nutrition__ul__item__text');
  let pCarbQuantity = createNewElement(
    'p',
    `${recipe.recipe.totalNutrients.CHOCDF.quantity.toFixed(1)} ${
      recipe.recipe.totalNutrients.CHOCDF.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  carbs.appendChild(pCarb);
  carbs.appendChild(pCarbQuantity);

  let protein = createNewElement('li', '', 'nutrition__ul__item');
  let pProtein = createNewElement('p', `Protein`, 'nutrition__ul__item__text');
  let pProteinQuantity = createNewElement(
    'p',
    `${recipe.recipe.totalNutrients.PROCNT.quantity.toFixed(1)} ${
      recipe.recipe.totalNutrients.PROCNT.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  protein.appendChild(pProtein);
  protein.appendChild(pProteinQuantity);

  let salt = createNewElement('li', '', 'nutrition__ul__item');
  let pSalt = createNewElement('p', `Salt`, 'nutrition__ul__item__text');
  let pSaltQuantity = createNewElement(
    'p',
    `${recipe.recipe.totalNutrients.NA.quantity.toFixed(1)} ${
      recipe.recipe.totalNutrients.NA.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  salt.appendChild(pSalt);
  salt.appendChild(pSaltQuantity);

  let sugar = createNewElement('li', '', 'nutrition__ul__item');
  let pSugar = createNewElement('p', `Sugar`, 'nutrition__ul__item__text');
  let pSugarQuantity = createNewElement(
    'p',
    `${recipe.recipe.totalNutrients.SUGAR.quantity.toFixed(1)} ${
      recipe.recipe.totalNutrients.SUGAR.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  sugar.appendChild(pSugar);
  sugar.appendChild(pSugarQuantity);

  let satFat = createNewElement('li', '', 'nutrition__ul__item');
  let pSatFat = createNewElement('p', `Saturates`, 'nutrition__ul__item__text');
  let pSatFatQuantity = createNewElement(
    'p',
    `${recipe.recipe.totalNutrients.FASAT.quantity.toFixed(1)} ${
      recipe.recipe.totalNutrients.FASAT.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  satFat.appendChild(pSatFat);
  satFat.appendChild(pSatFatQuantity);

  nutritionUl.appendChild(fat);
  nutritionUl.appendChild(satFat);
  nutritionUl.appendChild(carbs);
  nutritionUl.appendChild(protein);
  nutritionUl.appendChild(salt);
  nutritionUl.appendChild(sugar);

  nutritionSection.appendChild(nutritionTitle);
  nutritionSection.appendChild(nutritionUl);

  summaryContainer.appendChild(title);
  summaryContainer.appendChild(ul);
  summaryContainer.appendChild(nutritionSection);

  let ingredientsContainer = createNewElement('section', '', 'ingredients');
  let ingredientsTitle = createNewElement(
    'h2',
    'Ingredients',
    'ingredients__title'
  );
  let ingredientsUl = createNewElement('ul', '', 'ingredients__ul');
  let ingredientNodeList = recipe.recipe.ingredients.map((ingredient) => {
    return createNewElement('li', ingredient.text, 'ingredient__ul__li');
  });

  ingredientNodeList.forEach((node) => {
    ingredientsUl.appendChild(node);
  });

  ingredientsContainer.appendChild(ingredientsTitle);
  ingredientsContainer.appendChild(ingredientsUl);

  let briefContainer = createNewElement('div', '', 'summary-container');
  let imageContainer = createNewElement('div', '', 'summary-container__image');
  imageContainer.appendChild(image);

  briefContainer.appendChild(imageContainer);
  briefContainer.appendChild(summaryContainer);
  displayContainer.appendChild(briefContainer);
  displayContainer.appendChild(ingredientsContainer);
}

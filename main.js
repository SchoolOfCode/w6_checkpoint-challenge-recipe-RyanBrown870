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

  let title = createNewElement('h2', recipe.recipe.label, 'card__title');

  let image = createNewElement('img', '', 'card__image');
  image.setAttribute('src', recipe.recipe.image);

  let ul = createNewElement('ul', '', 'card__ul');

  let data = [
    recipe.recipe.yield,
    Math.floor(recipe.recipe.calories),
    recipe.recipe.totalTime,
  ];

  let dataNodes = data.map((item, index) => {
    let node = document.createElement('li');
    node.className = 'card__ul__li';
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

  let button = createNewElement(
    'a',
    'See Recipe',
    'btn card__btn',
    recipe.recipe.uri
  );
  button.setAttribute('data-index', index);
  button.setAttribute('data-uri', recipe.recipe.uri);
  button.addEventListener('click', displaySingleRecipe);

  card.append(title, image, ul, button);
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

  let servings = createNewElement('li', ``, 'recipe-summary__item');
  let pHeading = createNewElement(
    'p',
    'Serves',
    'recipe-summary__item__heading'
  );
  let pText = createNewElement(
    'p',
    `${recipe.recipe.yield}`,
    'recipe-summary__item__text'
  );
  servings.append(pHeading, pText);

  let calories = createNewElement('li', ``, 'recipe-summary__item');
  pHeading = createNewElement('p', 'Calories', 'recipe-summary__item__heading');
  pText = createNewElement(
    'p',
    `${Math.round(recipe.recipe.calories)}`,
    'recipe-summary__item__text'
  );
  calories.append(pHeading, pText);

  let time = createNewElement('li', ``, 'recipe-summary__item');
  pHeading = createNewElement(
    'p',
    'Prep time',
    'recipe-summary__item__heading'
  );
  pText = createNewElement(
    'p',
    `${recipe.recipe.totalTime} mins`,
    'recipe-summary__item__text'
  );
  time.append(pHeading, pText);

  let source = createNewElement('li', ``, 'recipe-summary__item');
  pHeading = createNewElement('p', 'Source', 'recipe-summary__item__heading');
  pText = createNewElement(
    'p',
    `${recipe.recipe.source}`,
    'recipe-summary__item__text'
  );
  source.append(pHeading, pText);

  let dietLabelText = recipe.recipe.dietLabels.join(', ');
  let dietLabels = createNewElement('li', '', 'recipe-summary__item');
  pHeading = createNewElement('p', 'Diet', 'recipe-summary__item__heading');
  pText = createNewElement('p', dietLabelText, 'recipe-summary__item__text');
  dietLabels.append(pHeading, pText);

  ul.append(servings, calories, time, source, dietLabels);

  let nutritionSection = createNewElement('section', '', 'nutrition');
  let nutritionTitle = createNewElement('h2', 'Nutrition', 'nutrition__title');

  let nutritionUl = createNewElement('ul', '', 'nutrition__ul');
  let fat = createNewElement('li', '', 'nutrition__ul__item');
  let pFat = createNewElement('p', `fat`, 'nutrition__ul__item__text');
  let pFatQuantity = createNewElement(
    'p',
    `${Math.round(recipe.recipe.totalNutrients.FAT.quantity)} ${
      recipe.recipe.totalNutrients.FAT.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  fat.append(pFat, pFatQuantity);

  let carbs = createNewElement('li', '', 'nutrition__ul__item');
  let pCarb = createNewElement('p', `carbs`, 'nutrition__ul__item__text');
  let pCarbQuantity = createNewElement(
    'p',
    `${Math.round(recipe.recipe.totalNutrients.CHOCDF.quantity)} ${
      recipe.recipe.totalNutrients.CHOCDF.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  carbs.append(pCarb, pCarbQuantity);

  let protein = createNewElement('li', '', 'nutrition__ul__item');
  let pProtein = createNewElement('p', `protein`, 'nutrition__ul__item__text');
  let pProteinQuantity = createNewElement(
    'p',
    `${Math.round(recipe.recipe.totalNutrients.PROCNT.quantity)} ${
      recipe.recipe.totalNutrients.PROCNT.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  protein.append(pProtein, pProteinQuantity);

  let salt = createNewElement('li', '', 'nutrition__ul__item');
  let pSalt = createNewElement('p', `salt`, 'nutrition__ul__item__text');
  let pSaltQuantity = createNewElement(
    'p',
    `${Math.round(recipe.recipe.totalNutrients.NA.quantity)} ${
      recipe.recipe.totalNutrients.NA.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  salt.append(pSalt, pSaltQuantity);

  let sugar = createNewElement('li', '', 'nutrition__ul__item');
  let pSugar = createNewElement('p', `sugar`, 'nutrition__ul__item__text');
  let pSugarQuantity = createNewElement(
    'p',
    `${Math.round(recipe.recipe.totalNutrients.SUGAR.quantity)} ${
      recipe.recipe.totalNutrients.SUGAR.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  sugar.append(pSugar, pSugarQuantity);

  let satFat = createNewElement('li', '', 'nutrition__ul__item');
  let pSatFat = createNewElement('p', `saturates`, 'nutrition__ul__item__text');
  let pSatFatQuantity = createNewElement(
    'p',
    `${Math.round(recipe.recipe.totalNutrients.FASAT.quantity)} ${
      recipe.recipe.totalNutrients.FASAT.unit
    }`,
    'nutrition__ul__item__quantity'
  );
  satFat.append(pSatFat, pSatFatQuantity);
  nutritionUl.append(fat, satFat, carbs, protein, salt, sugar);
  nutritionSection.append(nutritionTitle, nutritionUl);
  summaryContainer.append(title, ul, nutritionSection);

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

  ingredientsContainer.append(ingredientsTitle, ingredientsUl);

  let briefContainer = createNewElement('div', '', 'summary-container');
  let imageContainer = createNewElement('div', '', 'summary-container__image');
  imageContainer.appendChild(image);

  briefContainer.append(imageContainer, summaryContainer);
  displayContainer.append(briefContainer, ingredientsContainer);
}

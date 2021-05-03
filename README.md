# Fetch

## Pseudo-code Plan:

### handleSearchClick function

take in the search parameters
Already have the query (food)

9 recipes
call buildResultsList function

### displaySingleRecipe

function needs to take in event object as a parameter
event object will be undefined if not passsed in
if event object is undefined, send an api request for a random recipe (call recipeOfTheDay function)
if event object is truthy, send an api with the r = uri in the search query string
create a header container element (div/section)
create an image from the recipe data
create title element
create all data elements (author - in mealtype.source, rating, information e.g. time, difficulty, servings, lunch etc)
create nutritional information elements (e.g. cals, fat etc)
create ingredient li's from the array (loop through)
append the elements to the header container

call this at the beginning

### buildRecipeCard

function that takes in the recipe item from the looped array method
create container element
create title h2 element
create img element
create information (yield, cals, meal type, time)
create button with an onclick to call displaySingleRecipe
set the dataset attribute to the recipe uri
Need to know which recipe is being clicked
append all elements to the container element
return the container element

### buildResultsList

function takes in recipe object
reset the container - set displayContainer.innerHTML to empty string
loop through the hits array
create container element by calling buildRecipeCard function and saving as a variable
append variable to the container

### recipeOfTheDay

function that takes in no parameters
send a request with many keywords and from 0 to 100
Math.random for random array index in the hits array
return the recipe

## extras

extra parameters
-vegan
-vegetarian
-cuisine-type
-time
-excluded (allergies - nuts, egg, shellfish)
store the extra paramters in an object (e.g. vegan: true)
Either change the url request or loop through a large results array and filter what we want to exclude

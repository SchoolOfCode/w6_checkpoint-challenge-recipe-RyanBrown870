# Fetch

## Pseudo-code Plan:

### handleSearchClick function

1. Take in the search parameters
2. Already have the query (food)
3. Call buildResultsList function

### displaySingleRecipe

1. function needs to take in event object as a parameter
2. event object will be undefined if not passsed in
   - if event object is undefined, send an api request for a random recipe (call recipeOfTheDay function)
   - if event object is truthy, send an api with the r = uri in the search query string
3. create a header container element (div/section)
4. create an image from the recipe data
5. create title element
6. create all data elements (author - in mealtype.source, rating, information e.g. time, difficulty, servings, lunch etc)
7. create nutritional information elements (e.g. cals, fat etc)
8. create ingredient li's from the array (loop through)
9. append the elements to the header container

Call this function at the beginning of the js file

### buildRecipeCard

1. function that takes in the recipe item from the looped array method
2. create container element
3. create title h2 element
4. create img element
5. create information (yield, cals, meal type, time)
6. create button with an onclick to call displaySingleRecipe
7. set the dataset attribute to the recipe uri
8. Need to know which recipe is being clicked
9. append all elements to the container element
10. return the container element

### buildResultsList

1. function takes in recipe object
2. reset the container - set displayContainer.innerHTML to empty string
3. loop through the hits array
4. create container element by calling buildRecipeCard function and saving as a variable
5. append variable to the container

### recipeOfTheDay

1. function that takes in no parameters
2. send a request with many keywords and from 0 to 100
3. Math.random for random array index in the hits array
4. return the recipe

## Extras

#### Extra Parameters for Search Bar

- vegan
- vegetarian
- cuisine-type
- time
- excluded (allergies - nuts, egg, shellfish)

Store the extra paramters in an object (e.g. vegan: true).

Either change the url request or loop through a large results array and filter what we want to exclude.

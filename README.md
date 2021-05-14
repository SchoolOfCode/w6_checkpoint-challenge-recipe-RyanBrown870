# Fetch
## Pseudo-code Plan:

### handleSearchClick function

1. Take in the search parameters

2. Already have the query (food)
    - done
3. Call buildResultsList function


### displaySingleRecipe

1. function needs to take in event object (click of button of receipe card) as a parameter
2. if statement which checks event 
   - if event object is truthy, send an api with the fetch request r = uri (event.target.dataset) in the search query string (instead of q =)
   - if event object is falsy, call recipeOfTheDay function

2. create section-container element
   - give section an id, classes (re single recipe)
3. create title h2 element
   - set h2.innerHTML to recipe.label
4. create img element
   - set img.src  to recipe.image
   - set class to change size etc
5. create and ul for information (yield, cals, meal type, time)
   create li element and set inner.HTML to be value of
   - recipe.yield
   - recipe.calories
   - recipe.totalTime
   - recipe.source
   - recipe.dietLabels
   - recipe.mealType   
   - recipe.totalNutrients.FAT
   - recipe.totalNutrients.CHOCDF
   - recipe.totalNutrients.PROCNT
   - recipe.totalNutrients.NA
   - recipe.totalNutrients.SUGAR
   - recipe.totalNutrients.FASAT
   append li children for each
6. map through the recipe.ingredientLines array (on recipe object) array to give nodelist array 
   - create li element and set inner.HTML to be value of that item
7. Loop through node list and append li elements
7. Append the elements to the section container

Call this function at the beginning of the js file

### buildRecipeCard

1. function that takes in the recipe item from the looped array method
2. create section-container element
   - give each section an id, classes (re styling indiv cards)
3. create title h2 element
   - set h2.innerHTML to recipe.label
4. create img element
   - set img.src  to recipe.image
5. create and ul for information (yield, cals, meal type, time)
   create li element and set inner.HTML to be value of
   - recipe.yield
   - recipe.calories
   - recipe.totalTime
   append li children for each
6. create button
   - add eventListener of "click" and call displaySingleRecipe 
   - add an id (uri)
   - set the dataset attribute to the recipe.uri
   - add eventListener of "click" and call displaySingleRecipe
7. append elements to section
   - h2
   - image
   - ul
   - button
8. return section element

   
### buildResultsList

1. function takes in recipe object
2. reset the container 
   - get container from DOM using container ID
   - set displayContainer.innerHTML to empty string
3. map through the hits (on recipe object) array to give nodelist array
   - create container section element by calling buildRecipeCard function and pass in recipe item to the function
   - return result (container element) to buildRecipeCard
4. foreach through nodelist to append all elements to container

### recipeOfTheDay

1. function that takes in no parameters
2. send a fetch request with many keywords and .from 0 .to 100
3. use Math.random for random array index in the hits array
4. return the recipe to the displaySingleRecipeCard function

## BONUS TASK Extras

#### Extra Parameters for Search Bar

- vegan
- vegetarian
- cuisine-type
- time
- excluded (allergies - nuts, egg, shellfish)

Store the extra paramters in an object (e.g. vegan: true).
Either change the url request or loop through a large results array and filter what we want to exclude.

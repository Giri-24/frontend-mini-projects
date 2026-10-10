// script.js

// Sample recipe data
const recipeData = {
  title: "Chicken Fajitas",
  image: "https://example.com/chicken-fajitas.jpg",
  servings: 4,
  cookingTime: 30,
  difficulty: "Easy",
  ingredients: [
      { name: "1 lb boneless, skinless chicken breasts", quantity: "" },
      { name: "1/2 cup sliced bell peppers", quantity: "" },
      { name: "1/2 cup sliced onions", quantity: "" },
      { name: "2 cloves garlic, minced", quantity: "" },
      { name: "1 tablespoon olive oil", quantity: "" },
      { name: "1 teaspoon cumin", quantity: "" },
      { name: "Salt and pepper, to taste", quantity: "" }
  ],
  instructions: [
      "Heat olive oil in a large skillet over medium-high heat.",
      "Add chicken and cook until browned, about 5 minutes.",
      "Add bell peppers and onions; cook until tender, about 5 minutes.",
      "Add garlic, cumin, salt, and pepper; cook for 1 minute.",
      "Serve hot with warm flour tortillas."
  ]
};

// Populate recipe card with data
document.getElementById("recipe-title").textContent = recipeData.title;
document.getElementById("recipe-image").src = recipeData.image;
document.getElementById("servings").textContent = `Servings: ${recipeData.servings}`;
document.getElementById("cooking-time").textContent = `Cooking Time: ${recipeData.cookingTime} minutes`;
document.getElementById("difficulty").textContent = `Difficulty: ${recipeData.difficulty}`;

// Populate ingredient list
const ingredientList = document.getElementById("ingredient-list");
recipeData.ingredients.forEach((ingredient) => {
  const li = document.createElement("li");
  li.textContent = `${ingredient.name} ${ingredient.quantity}`;
  ingredientList.appendChild(li);
});

// Populate instruction list
const instructionList = document.getElementById("instruction-list");
recipeData.instructions.forEach((instruction, index) => {
  const li = document.createElement("li");
  li.textContent = `${index + 1}. ${instruction}`;
  instructionList.appendChild(li);
});

// Toggle instructions
const toggleButton = document.getElementById("toggle-instructions");
const instructionSection = document.querySelector(".instructions");
toggleButton.addEventListener("click", () => {
  instructionSection.classList.toggle("hidden");
  toggleButton.textContent = instructionSection.classList.contains("hidden")

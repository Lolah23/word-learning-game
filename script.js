document.addEventListener("DOMContentLoaded", () => {
  const startGameBtn = document.getElementById("startGameBtn");
  const categorySection = document.getElementById("categorySection");
  const chooseCategoryBtn = document.getElementById("chooseCategoryBtn");
  const categories = document.getElementById("categories");
  const gameSection = document.getElementById("gameSection");
  const questionEl = document.getElementById("question");
  const choicesEl = document.getElementById("choices");
  const feedbackEl = document.getElementById("feedback");

  const words = {
    animals: ["Cat", "Dog", "Elephant", "Lion", "Tiger"],
    colors: ["Red", "Blue", "Green", "Yellow", "Purple"],
    fruits: ["Apple", "Banana", "Cherry", "Grape", "Orange"],
  };

  let selectedCategory = "";
  let currentWordIndex = 0;

  startGameBtn.addEventListener("click", () => {
    categorySection.classList.remove("hidden");
    startGameBtn.classList.add("hidden");
  });

  chooseCategoryBtn.addEventListener("click", () => {
    selectedCategory = categories.value;
    currentWordIndex = 0;
    categorySection.classList.add("hidden");
    gameSection.classList.remove("hidden");
    loadWord();
  });

  function loadWord() {
    const categoryWords = words[selectedCategory];
    const word = categoryWords[currentWordIndex];

    questionEl.textContent = `Which category does "${word}" belong to?`;
    choicesEl.innerHTML = "";

    for (const category in words) {
      const btn = document.createElement("button");
      btn.textContent = category;
      btn.addEventListener("click", () => checkAnswer(category));
      choicesEl.appendChild(btn);
    }
  }

  // Expose checkAnswer globally for testing
  window.checkAnswer = function(category) {
    if (category === selectedCategory) {
      feedbackEl.textContent = "Correct!";
      feedbackEl.style.color = "green";
      currentWordIndex++;
      if (currentWordIndex < words[selectedCategory].length) {
        loadWord();
      } else {
        feedbackEl.textContent = "You completed the game!";
        feedbackEl.style.color = "blue";
      }
    } else {
      feedbackEl.textContent = "Try again!";
      feedbackEl.style.color = "red";
    }
  };
});


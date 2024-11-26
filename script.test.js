const { JSDOM } = require("jsdom");

let document;

beforeAll(async () => {
  let dom = await JSDOM.fromFile("./index.html", {
    runScripts: "dangerously",
    resources: 'usable',
  });
  document = dom.window.document;

  // Wait for DOMContentLoaded
  await new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", resolve);
  });
});

describe("Game initial state", () => {

  test("contains only start button when loaded first", () => {
    const startButton = document.getElementById("startGameBtn");
    expect(startButton.classList.contains("hidden")).toBe(false);

    const categorySection = document.getElementById("categorySection");
    expect(categorySection.classList.contains("hidden")).toBe(true);

    const gameSection = document.getElementById("gameSection");
    expect(gameSection.classList.contains("hidden")).toBe(true);
  });

  test("proceeds when start button is pressed", () => {
    const startButton = document.getElementById("startGameBtn");
    expect(startButton.classList.contains("hidden")).toBe(false);

    startButton.click();

    expect(startButton.classList.contains("hidden")).toBe(true);
  });
})

describe("Game setup", () => {

  beforeEach(() => {
    const startButton = document.getElementById("startGameBtn");
    startButton.click();
  });

  test("game is hidden when category is not choosen", () => {
    const gameSection = document.getElementById("gameSection");
    expect(gameSection.classList.contains("hidden")).toBe(true);
  });

  test("contains an desctription next to select box", () => {
    const categorySection = document.getElementById("categorySection");
    expect(categorySection.children[0].textContent).toBe("Choose a word category:");
  });

  test("category select box contains all categories and defaults choise to 'Animals'", () => {
    const categorySelectBox = document.getElementById("categories");

    expect(categorySelectBox.classList.contains("hidden")).toBe(false);
    expect(categorySelectBox.children.length).toBe(3);
    expect(categorySelectBox.children[0].textContent).toBe("Animals");
    expect(categorySelectBox.children[1].textContent).toBe("Colors");
    expect(categorySelectBox.children[2].textContent).toBe("Fruits");
  });

  test("poceeds to the game with correct category selected", () => {
    const categorySelectBox = document.getElementById("categories");
    categorySelectBox.selectedIndex = "2"; // choose Fruits as category

    const startLearningButton = document.getElementById("chooseCategoryBtn");
    startLearningButton.click();

    const question = document.getElementById("question");

    expect(question.textContent).toBe(`Which category does "Apple" belong to?`);
  });
})

describe("Game start (Colors category)", () => {

  beforeEach(() => {
    const startButton = document.getElementById("startGameBtn");
    startButton.click();

    const categorySelectBox = document.getElementById("categories");
    categorySelectBox.selectedIndex = "1"; // choose "colors" as category

    const startLearningButton = document.getElementById("chooseCategoryBtn");
    startLearningButton.click();
  });

  test(`shows feedback as "correct" and does proceed to next question when correct answer is choosen`, () => {
    const question = document.getElementById("question");
    expect(question.textContent).toBe(`Which category does "Red" belong to?`);

    const answers = document.getElementById("choices");
    const correctAnswer = answers.children[1]; // choose answer as "colors"

    correctAnswer.click();

    const feedback = document.getElementById("feedback");
    expect(feedback.textContent).toBe("Correct!");
    expect(feedback.style.color).toBe("green");

    expect(question.textContent).toBe(`Which category does "Blue" belong to?`);
  });

  test(`shows feedback as "try again" and does not proceed to next question when wrong answer is choosen`, () => {
    const question = document.getElementById("question");
    expect(question.textContent).toBe(`Which category does "Red" belong to?`);

    const answers = document.getElementById("choices");
    const wrongAnswer = answers.children[0]; // choose answer as "animals"

    wrongAnswer.click();

    const feedback = document.getElementById("feedback");
    expect(feedback.textContent).toBe("Try again!");
    expect(feedback.style.color).toBe("red");

    expect(question.textContent).toBe(`Which category does "Red" belong to?`);
  });

  test(`shows feedback as "game complete" when last answer have been given and does not change the question further`, () => {
    // It's not possible to mock const words = { ... } in script.js so we can't test all answers
    // Therefore, we need to manually answer all questions to reach the end of the game

    const question = document.getElementById("question");
    expect(question.textContent).toBe(`Which category does "Red" belong to?`);

    const answers = document.getElementById("choices");
    const correctAnswer = answers.children[1]; // choose answer as "colors"

    correctAnswer.click();
    correctAnswer.click();
    correctAnswer.click();
    correctAnswer.click();
    correctAnswer.click();

    const feedback = document.getElementById("feedback");
    expect(feedback.textContent).toBe("You completed the game!");
    expect(feedback.style.color).toBe("blue");

    expect(question.textContent).toBe(`Which category does "Purple" belong to?`);
  });
})

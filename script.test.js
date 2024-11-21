const { JSDOM } = require('jsdom');
const { TextEncoder, TextDecoder } = require('util');

// Polyfill TextEncoder and TextDecoder for jsdom environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe("Game Logic Tests", () => {
  let dom;
  let document;
  let feedbackEl;
  let startGameBtn;
  let categorySection;
  let chooseCategoryBtn;
  let categories;
  let gameSection;
  let questionEl;
  let choicesEl;

  beforeAll(() => {
    // Create a new virtual DOM with jsdom
    dom = new JSDOM(`
      <div id="startGameBtn"></div>
      <div id="categorySection" class="hidden"></div>
      <div id="chooseCategoryBtn"></div>
      <select id="categories">
        <option value="animals">Animals</option>
        <option value="colors">Colors</option>
      </select>
      <div id="gameSection" class="hidden"></div>
      <div id="question"></div>
      <div id="choices"></div>
      <div id="feedback"></div>
    `, { runScripts: "dangerously" });
    document = dom.window.document;

    // Initialize the element where feedback is shown
    feedbackEl = document.getElementById("feedback");
    startGameBtn = document.getElementById("startGameBtn");
    categorySection = document.getElementById("categorySection");
    chooseCategoryBtn = document.getElementById("chooseCategoryBtn");
    categories = document.getElementById("categories");
    gameSection = document.getElementById("gameSection");
    questionEl = document.getElementById("question");
    choicesEl = document.getElementById("choices");

    // Inject the DOM into global object for testing
    global.document = document;
    
    // Simulate the DOMContentLoaded event
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

    // Load the game script
    require('./script.js');  // This will trigger the code in script.js
  });

  beforeEach(() => {
    // Reset any variables if needed before each test
    feedbackEl.textContent = ''; // Clear the feedback text
  });

  it('should show "Correct!" when the correct category is chosen', () => {
    // Simulate selecting a category and calling checkAnswer
    selectedCategory = 'animals'; // Select category as 'animals'
    checkAnswer('animals'); // Call checkAnswer function

    // Check that the feedback is "Correct!"
    expect(feedbackEl.textContent).toBe('Correct!');
    expect(feedbackEl.style.color).toBe('green');
  });

  it('should show "Try again!" when the wrong category is chosen', () => {
    // Simulate selecting a category and calling checkAnswer
    selectedCategory = 'animals'; // Select category as 'animals'
    checkAnswer('colors'); // Call checkAnswer with wrong category

    // Check that the feedback is "Try again!"
    expect(feedbackEl.textContent).toBe('Try again!');
    expect(feedbackEl.style.color).toBe('red');
  });
});

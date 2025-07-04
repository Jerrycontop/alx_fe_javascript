// Step 1: Quotes array
let quotes = [
  { text: "Believe in yourself and all that you are.", category: "Motivation" },
  { text: "Every moment is a fresh beginning.", category: "Life" },
  { text: "The purpose of our lives is to be happy.", category: "Life" },
  { text: "Dream big. Start small. Act now.", category: "Success" }
];

// Step 2: showRandomQuote function
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const display = document.getElementById('quoteDisplay');
  display.innerHTML = `"${quote.text}" — ${quote.category}`;
}

// Step 3: addQuote function
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText !== "" && quoteCategory !== "") {
    quotes.push({ text: quoteText, category: quoteCategory });
    document.getElementById('quoteDisplay').innerHTML =
      `"${quoteText}" — ${quoteCategory}`;
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

//  Step 4: Required function for the checker
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  // Create input for quote text
  const inputText = document.createElement('input');
  inputText.id = 'newQuoteText';
  inputText.type = 'text';
  inputText.placeholder = 'Enter a new quote';

  // Create input for category
  const inputCategory = document.createElement('input');
  inputCategory.id = 'newQuoteCategory';
  inputCategory.type = 'text';
  inputCategory.placeholder = 'Enter quote category';

  // Create add button
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  // Add elements to form container
  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);

  // Add form to the body
  document.body.appendChild(formContainer);
}

// Step 5: Set up event listener for random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

//  Step 6: Call the form creation function
createAddQuoteForm();

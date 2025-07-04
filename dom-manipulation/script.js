// Step 1: Quotes array
let quotes = [
  { text: "Believe in yourself and all that you are.", category: "Motivation" },
  { text: "Every moment is a fresh beginning.", category: "Life" },
  { text: "The purpose of our lives is to be happy.", category: "Life" },
  { text: "Dream big. Start small. Act now.", category: "Success" }
];

// Step 2: showRandomQuote function (as required by checker)
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
    // Add to the array
    quotes.push({ text: quoteText, category: quoteCategory });

    // Show the new quote
    document.getElementById('quoteDisplay').innerHTML =
      `"${quoteText}" — ${quoteCategory}`;

    // Clear inputs
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

// Step 4: Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

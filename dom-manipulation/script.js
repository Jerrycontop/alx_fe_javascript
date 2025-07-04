// Quotes array
let quotes = [
  { text: "Believe in yourself and all that you are.", category: "Motivation" },
  { text: "Every moment is a fresh beginning.", category: "Life" },
  { text: "The purpose of our lives is to be happy.", category: "Life" },
  { text: "Dream big. Start small. Act now.", category: "Success" }
];

// Show a random quote from the array
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const display = document.getElementById('quoteDisplay');
  display.innerHTML = `"${quote.text}" — ${quote.category}`;
}

// Add a new quote from the input fields
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText !== "" && quoteCategory !== "") {
    quotes.push({ text: quoteText, category: quoteCategory });

    // Update the display with the new quote using innerHTML
    document.getElementById('quoteDisplay').innerHTML =
      `"${quoteText}" — ${quoteCategory}`;

    // Clear inputs
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

// Attach event listener to "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

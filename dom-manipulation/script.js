let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "Believe in yourself.", category: "Motivation" },
      { text: "Keep pushing forward.", category: "Inspiration" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  let filtered = quotes;

  if (selectedCategory !== 'all') {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = "No quotes found in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" — ${quote.category}`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText && quoteCategory) {
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    postQuoteToServer(newQuote); // Post to mock server
    document.getElementById('quoteDisplay').innerHTML = `"${quoteText}" — ${quoteCategory}`;
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

// Create add quote form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const inputText = document.createElement('input');
  inputText.id = 'newQuoteText';
  inputText.type = 'text';
  inputText.placeholder = 'Enter a new quote';

  const inputCategory = document.createElement('input');
  inputCategory.id = 'newQuoteCategory';
  inputCategory.type = 'text';
  inputCategory.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);
  document.body.appendChild(formContainer);
}

// Export quotes to JSON file
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Populate category dropdown
function populateCategories() {
  const dropdown = document.getElementById('categoryFilter');
  const selected = dropdown.value;

  dropdown.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    dropdown.appendChild(option);
  });

  dropdown.value = selected;
}

// Filter quotes
function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastFilter', category);
  showRandomQuote();
}

// Display last quote viewed
function displayLastQuote() {
  const last = sessionStorage.getItem('lastQuote');
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" — ${quote.category}`;
  }
}

// Restore category filter
function restoreFilter() {
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    document.getElementById('categoryFilter').value = lastFilter;
  }
}

// ✅ Fetch quotes from mock server using async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// ✅ Post a quote to the mock server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
    const result = await response.json();
    console.log("Posted to server:", result);
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// ✅ Sync quotes and resolve conflicts
function syncQuotes() {
  fetchQuotesFromServer().then((serverQuotes) => {
    let updated = false;

    serverQuotes.forEach(serverQuote => {
      const exists = quotes.some(
        q => q.text === serverQuote.text && q.category === serverQuote.category
      );
      if (!exists) {
        quotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      showSyncNotification();
    }
  });
}

// ✅ Show sync notification
function showSyncNotification() {
  const notice = document.getElementById('syncNotice');
  notice.style.display = 'block';
  setTimeout(() => (notice.style.display = 'none'), 5000);
}

// ✅ Periodically sync every 30 seconds
setInterval(syncQuotes, 30000);

// ✅ Initialize App
loadQuotes();
createAddQuoteForm();
populateCategories();
restoreFilter();
displayLastQuote();
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

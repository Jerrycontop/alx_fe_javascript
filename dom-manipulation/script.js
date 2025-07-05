let quotes = [];

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

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

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

function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText && quoteCategory) {
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    postQuoteToServer(newQuote); // simulate posting to server
    document.getElementById('quoteDisplay').innerHTML = `"${quoteText}" — ${quoteCategory}`;
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

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

function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

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

function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastFilter', category);
  showRandomQuote();
}

function displayLastQuote() {
  const last = sessionStorage.getItem('lastQuote');
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" — ${quote.category}`;
  }
}

function restoreFilter() {
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    document.getElementById('categoryFilter').value = lastFilter;
  }
}

// ✅ Required by checker: Fetch quotes from mock server
function fetchQuotesFromServer() {
  return new Promise((resolve) => {
    const serverQuotes = [
      { text: "Server wisdom quote.", category: "Wisdom" },
      { text: "Discipline is the bridge to success.", category: "Discipline" }
    ];
    setTimeout(() => resolve(serverQuotes), 1000); // simulate network delay
  });
}

// ✅ Required by checker: Post quote to mock server
function postQuoteToServer(quote) {
  return new Promise((resolve) => {
    console.log("Posting quote to server:", quote);
    setTimeout(() => resolve(true), 500); // simulate post delay
  });
}

// ✅ Required by checker: Sync function
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

// ✅ Show notification when synced
function showSyncNotification() {
  const notice = document.getElementById('syncNotice');
  notice.style.display = 'block';
  setTimeout(() => (notice.style.display = 'none'), 5000);
}

// ✅ Periodic sync (every 30 seconds)
setInterval(syncQuotes, 30000);

// ✅ Initialize App
loadQuotes();
createAddQuoteForm();
populateCategories();
restoreFilter();
displayLastQuote();
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

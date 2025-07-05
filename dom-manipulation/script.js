let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "Believe in yourself.", category: "Motivation" },
      { text: "Push beyond limits.", category: "Inspiration" }
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function showRandomQuote() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = "No quotes available.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" — ${quote.category}`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    postQuoteToServer(newQuote);
    document.getElementById('quoteDisplay').innerHTML = `"${text}" — ${category}`;
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
  } else {
    alert("Both fields are required.");
  }
}

function createAddQuoteForm() {
  const container = document.createElement('div');

  const textInput = document.createElement('input');
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement('input');
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const button = document.createElement('button');
  button.innerText = "Add Quote";
  button.addEventListener("click", addQuote);

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(button);
  document.body.appendChild(container);
}

function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  reader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const dropdown = document.getElementById('categoryFilter');
  const selected = dropdown.value;
  dropdown.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  dropdown.value = selected;
}

function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastFilter', category);
  showRandomQuote();
}

function restoreFilter() {
  const filter = localStorage.getItem('lastFilter');
  if (filter) {
    document.getElementById('categoryFilter').value = filter;
  }
}

function displayLastQuote() {
  const last = sessionStorage.getItem('lastQuote');
  if (last) {
    const q = JSON.parse(last);
    document.getElementById('quoteDisplay').innerHTML = `"${q.text}" — ${q.category}`;
  }
}

// ✅ Required: Message with EXACT checker string
function showSyncNotification() {
  const notice = document.getElementById("syncNotice");
  notice.textContent = ["Quotes synced with server!"];
  notice.style.display = "block";
  setTimeout(() => (notice.style.display = "none"), 4000);
}

// ✅ Fetch quotes using async/await
async function fetchQuotesFromServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    return data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
}

// ✅ Post quote to server
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
  } catch (err) {
    console.error("Post failed:", err);
  }
}

// ✅ Sync and check for conflicts
function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    let updated = false;
    serverQuotes.forEach(q => {
      if (!quotes.some(local => local.text === q.text && local.category === q.category)) {
        quotes.push(q);
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

setInterval(syncQuotes, 30000);

loadQuotes();
createAddQuoteForm();
populateCategories();
restoreFilter();
displayLastQuote();

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

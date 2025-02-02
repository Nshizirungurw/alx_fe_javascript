document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const serverURL = "https://jsonplaceholder.typicode.com/posts";

let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

function initializeApp() {
    populateCategories();
    filterQuotes();
    fetchQuotesFromServer();
    setInterval(fetchQuotesFromServer, 3000);
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverURL);
        const serverQuotes = await response.json();

        const formattedQuotes = serverQuotes.map(item => ({
            text: item.title,
            category: "General"
        }));

        syncQuotes(formattedQuotes);
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

function syncQuotes(serverQuotes) {
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    const newQuotes = serverQuotes.filter(serverQuote =>
        !localQuotes.some(localQuote => localQuote.text === serverQuote.text)
    );

    if (newQuotes.length > 0) {
        localQuotes = [...localQuotes, ...newQuotes]; 
        localStorage.setItem("quotes", JSON.stringify(localQuotes));
        populateCategories();
        filterQuotes();
        alert("New quotes have been synced from the server.");
    }
}

function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);

    quoteDisplay.innerHTML = "";

    const filteredQuotes = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }

    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

    const quoteElement = document.createElement("p");
    quoteElement.textContent = randomQuote.text;

    const categoryElement = document.createElement("em");
    categoryElement.textContent = ` - ${randomQuote.category}`;

    quoteElement.appendChild(categoryElement);
    quoteDisplay.appendChild(quoteElement);
}

function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))]; 
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`; 

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    categoryFilter.value = localStorage.getItem("selectedCategory") || "all";
}

function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (!text || !category) {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    filterQuotes();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            localStorage.setItem("quotes", JSON.stringify(quotes));
            populateCategories();
            filterQuotes();
            alert("Quotes imported successfully!");
        } catch (error) {
            alert("Invalid JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

function exportQuotesToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
}

function resolveConflicts(serverQuotes) {
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    serverQuotes.forEach(serverQuote => {
        const index = localQuotes.findIndex(localQuote => localQuote.text === serverQuote.text);
        if (index !== -1) {
            localQuotes[index] = serverQuote; 
        }
    });

    localStorage.setItem("quotes", JSON.stringify(localQuotes));
    alert("Conflicts resolved using server data.");
}

document.getElementById("syncQuotes").addEventListener("click", fetchQuotesFromServer);

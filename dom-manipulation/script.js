const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const importFileInput = document.getElementById("importFile");

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The journey of a thousand miles begins with one step.", category: "Inspiration" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" }
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))]; 
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        if (category === selectedCategory) {
            option.selected = true; 
        }
        categoryFilter.appendChild(option);
    });
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


function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes(); 

        populateCategories(); 
        filterQuotes(); 

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    } else {
        alert("Please enter both a quote and a category.");
    }
}

function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                filterQuotes();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid JSON format.");
            }
        } catch (error) {
            alert("Error reading JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

document.getElementById("newQuote").addEventListener("click", filterQuotes);
document.getElementById("addQuote").addEventListener("click", addQuote);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
importFileInput.addEventListener("change", importFromJsonFile);

populateCategories();
filterQuotes();

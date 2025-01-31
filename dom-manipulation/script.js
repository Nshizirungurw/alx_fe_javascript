const quoteDisplay = document.getElementById("quoteDisplay");
const importFileInput = document.getElementById("importFile");

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The journey of a thousand miles begins with one step.", category: "Inspiration" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" }
];

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
    quoteDisplay.innerHTML = ""; 
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteObj = quotes[randomIndex];

    const quoteElement = document.createElement("p");
    quoteElement.textContent = quoteObj.text;

    const categoryElement = document.createElement("em");
    categoryElement.textContent = ` - ${quoteObj.category}`;

    quoteElement.appendChild(categoryElement);
    quoteDisplay.appendChild(quoteElement);

    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quoteObj));
}

function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes(); 

        const newQuoteElement = document.createElement("p");
        newQuoteElement.textContent = newQuote.text;

        const newCategoryElement = document.createElement("em");
        newCategoryElement.textContent = ` - ${newQuote.category}`;

        newQuoteElement.appendChild(newCategoryElement);
        quoteDisplay.appendChild(newQuoteElement);

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
                alert("Quotes imported successfully!");
                showRandomQuote();
            } else {
                alert("Invalid JSON format.");
            }
        } catch (error) {
            alert("Error reading JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

function loadLastViewedQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastQuote) {
        quoteDisplay.innerHTML = `<p>${lastQuote.text} - <em>${lastQuote.category}</em></p>`;
    } else {
        showRandomQuote();
    }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuote").addEventListener("click", addQuote);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
importFileInput.addEventListener("change", importFromJsonFile);

loadLastViewedQuote();

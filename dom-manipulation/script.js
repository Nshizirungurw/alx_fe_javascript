
const quotes = [
    { text: "The journey of a thousand miles begins with one step.", category: "Inspiration" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" }
];

const quoteDisplay = document.getElementById("quoteDisplay");

function showRandomQuote() {
    quoteDisplay.innerHTML = ""; 
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteObj = quotes[randomIndex];

    const quoteElement = document.createElement("p");
    quoteElement.textContent = quoteObj.text;

    const categoryElement = document.createElement("em");
    categoryElement.textContent = ` - ${quoteObj.category}`;

    quoteElement.appendChild(categoryElement);
    quoteDisplay.appendChild(quoteElement);
}

function createAddQuoteForm() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText && newQuoteCategory) {

        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

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

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuote").addEventListener("click", addQuote);

showRandomQuote();

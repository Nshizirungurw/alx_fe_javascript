const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function syncQuotesWithServer() {
    try {
        const response = await fetch(SERVER_URL);
        const serverQuotes = await response.json();

        const formattedQuotes = serverQuotes.map(q => ({
            text: q.title, 
            category: "General"
        }));

        const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
        const mergedQuotes = mergeQuotes(localQuotes, formattedQuotes);

        localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
        quotes = mergedQuotes;
        populateCategories();
        filterQuotes();

        notifyUser("Quotes synced with the server.");
    } catch (error) {
        console.error("Error syncing with server:", error);
        notifyUser("Failed to sync with server.");
    }
}

function mergeQuotes(localQuotes, serverQuotes) {
    const quoteSet = new Map();
    [...serverQuotes, ...localQuotes].forEach(q => quoteSet.set(q.text, q));
    return Array.from(quoteSet.values()); 
}

function notifyUser(message) {
    alert(message); 
}

setInterval(syncQuotesWithServer, 30000);
function resolveConflict(localQuote, serverQuote) {
    const userChoice = confirm(
        `Conflict detected!\n\nLocal: "${localQuote.text}"\nServer: "${serverQuote.text}"\n\nKeep local version?`
    );
    return userChoice ? localQuote : serverQuote;
}

function mergeQuotes(localQuotes, serverQuotes) {
    const quoteMap = new Map();

    serverQuotes.forEach(q => quoteMap.set(q.text, q));
    localQuotes.forEach(q => {
        if (quoteMap.has(q.text)) {
            
            quoteMap.set(q.text, resolveConflict(q, quoteMap.get(q.text)));
        } else {
            quoteMap.set(q.text, q);
        }
    });

    return Array.from(quoteMap.values());
}

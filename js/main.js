const quotes = [
    {
        text: "That's what",
        author: "She",
        username: "demo"
    },
    {
        text: "Hello world!",
        author: "HTML",
        username: "demo"
    },
    {
        text: "You think you just fell out of a coconut tree?",
        author: "Madam president",
        username: "demo"
    },
    {
        text: "Show it to me Rachel! Show it to me please!",
        author: "Jesus lover",
        username: "demo"
    },
    {
        text: "Why are you running?",
        author: "Vine man",
        username: "demo"
    },
    {
        text: "Why are you running?",
        author: "Vine man",
        username: "demo"
    }
];

function renderQuotes() {
    const quoteFeed = document.getElementById('quote-feed');
    quoteFeed.innerHTML = quotes.map(quote => `
        <div class="quote-card">
            <p class="quote-text">"${quote.text}"</p>
            <div class="quote-footer">
                <p class="quote-author">— ${quote.author}</p>
                <p class="quote-username">Contributed by ${quote.username}</p>
            </div>
        </div>
    `).join('');
}

// Render quotes when the page loads
document.addEventListener('DOMContentLoaded', renderQuotes);
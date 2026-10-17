(function (root) {
  // Ids are saved as favorites, so they must never be changed or reused.
  const QUOTES = [
    { id: 'q01', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { id: 'q02', text: 'It always seems impossible until it is done.', author: 'Nelson Mandela' },
    { id: 'q03', text: 'What we think, we become.', author: 'Buddha' },
    { id: 'q04', text: 'The journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
    { id: 'q05', text: 'Whether you think you can, or you think you can’t, you’re right.', author: 'Henry Ford' },
    { id: 'q06', text: 'Well done is better than well said.', author: 'Benjamin Franklin' },
    { id: 'q07', text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
    { id: 'q08', text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
    { id: 'q09', text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle' },
    { id: 'q10', text: 'Happiness depends upon ourselves.', author: 'Aristotle' },
    { id: 'q11', text: 'You miss 100% of the shots you don’t take.', author: 'Wayne Gretzky' },
    { id: 'q12', text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' }
  ];

  function pickRandomQuote(quotes, excludeId, random = Math.random) {
    if (quotes.length === 0) {
      return null;
    }
    const candidates = quotes.filter((quote) => quote.id !== excludeId);
    // A single-quote list has nothing else to offer, so repeat it rather than fail.
    const pool = candidates.length > 0 ? candidates : quotes;
    return pool[Math.floor(random() * pool.length)];
  }

  const api = { QUOTES, pickRandomQuote };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.QuoteOfTheDay = Object.assign(root.QuoteOfTheDay || {}, api);
  }
})(typeof window !== 'undefined' ? window : globalThis);

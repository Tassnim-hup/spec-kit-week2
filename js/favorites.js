(function (root) {
  function isFavorite(favoriteIds, quoteId) {
    return favoriteIds.includes(quoteId);
  }

  // Returns a new list so callers can keep the old one if saving fails.
  function toggleFavorite(favoriteIds, quoteId) {
    if (isFavorite(favoriteIds, quoteId)) {
      return favoriteIds.filter((id) => id !== quoteId);
    }
    return [...favoriteIds, quoteId];
  }

  const api = { isFavorite, toggleFavorite };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.QuoteOfTheDay = Object.assign(root.QuoteOfTheDay || {}, api);
  }
})(typeof window !== 'undefined' ? window : globalThis);

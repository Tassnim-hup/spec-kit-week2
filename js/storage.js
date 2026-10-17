(function (root) {
  const FAVORITES_KEY = 'quoteOfTheDay.favorites';

  // Reading `localStorage` itself can throw when site data is blocked, so it is
  // only touched inside the try blocks below.
  function loadFavorites(storage) {
    try {
      const raw = (storage || localStorage).getItem(FAVORITES_KEY);
      if (raw === null) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return [...new Set(parsed.filter((id) => typeof id === 'string'))];
    } catch (error) {
      return [];
    }
  }

  function saveFavorites(favoriteIds, storage) {
    try {
      (storage || localStorage).setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
      return true;
    } catch (error) {
      return false;
    }
  }

  const api = { loadFavorites, saveFavorites };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.QuoteOfTheDay = Object.assign(root.QuoteOfTheDay || {}, api);
  }
})(typeof window !== 'undefined' ? window : globalThis);

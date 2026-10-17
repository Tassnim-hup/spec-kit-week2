(function () {
  const { QUOTES, pickRandomQuote, isFavorite, toggleFavorite, loadFavorites, saveFavorites } =
    window.QuoteOfTheDay;

  const state = {
    currentQuote: null,
    favoriteIds: [],
    notice: ''
  };

  const quoteTextElement = document.getElementById('quote-text');
  const quoteAuthorElement = document.getElementById('quote-author');
  const favoriteButton = document.getElementById('favorite-button');
  const noticeElement = document.getElementById('notice');

  function render() {
    quoteTextElement.textContent = state.currentQuote.text;
    quoteAuthorElement.textContent = state.currentQuote.author;

    const favorite = isFavorite(state.favoriteIds, state.currentQuote.id);
    favoriteButton.setAttribute('aria-pressed', String(favorite));
    favoriteButton.textContent = favorite ? '★ Favorited' : '☆ Add to favorites';

    noticeElement.textContent = state.notice;
  }

  document.getElementById('new-quote-button').addEventListener('click', () => {
    state.currentQuote = pickRandomQuote(QUOTES, state.currentQuote.id);
    state.notice = '';
    render();
  });

  favoriteButton.addEventListener('click', () => {
    const next = toggleFavorite(state.favoriteIds, state.currentQuote.id);
    if (saveFavorites(next)) {
      state.favoriteIds = next;
      state.notice = '';
    } else {
      // Keep the old list so the button never claims a favorite that was not saved.
      state.notice = 'Could not save your favorite. Your browser may be blocking storage.';
    }
    render();
  });

  document.addEventListener('DOMContentLoaded', () => {
    state.favoriteIds = loadFavorites();
    state.currentQuote = pickRandomQuote(QUOTES, null);
    render();
  });
})();

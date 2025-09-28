const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const pb = new PocketBase('/');

const state = {
  reviews: null,
  games: null,
};

const templates = {
  gameRow: $('#game-row-template'),
  reviewCard: $('#review-card-template'),
  message: $('#message-template'),
};

/**
 * Renders a message into a target container.
 * @param {HTMLElement} target
 * @param {string} message
 */
function renderMessage(target, message) {
  const clone = templates.message.content.cloneNode(true);
  clone.querySelector('[data-key="message"]').textContent = message;
  target.replaceChildren(clone);
}

/**
 * Securely renders items into a target element using a template.
 * @param {object} options
 * @param {HTMLElement} options.target - The container element.
 * @param {Array<object>} options.items - The array of data items.
 * @param {HTMLTemplateElement} options.template - The template to use.
 * @param {Function} options.onClone - A function to process each cloned node.
 */
function renderItems({ target, items, template, onClone }) {
  const fragment = new DocumentFragment();
  for (const item of items) {
    const clone = template.content.cloneNode(true);
    onClone(clone, item);
    fragment.appendChild(clone);
  }
  target.replaceChildren(fragment);
}

async function loadReviews() {
  const target = $('#reviews-target');
  if (state.reviews) {
    return renderReviews(); // Use cached data
  }

  renderMessage(target, 'Loading reviews...');
  try {
    const res = await pb.collection('reviews').getList(1, 20, {
      sort: '-created',
      expand: 'game',
    });
    state.reviews = res.items || [];
    renderReviews();
  } catch (e) {
    console.error(e);
    renderMessage(target, 'Failed to load reviews.');
  }
}

function renderReviews() {
  const target = $('#reviews-target');
  if (!state.reviews?.length) {
    renderMessage(target, 'No public reviews yet.');
    return;
  }

  renderItems({
    target,
    items: state.reviews,
    template: templates.reviewCard,
    onClone: (clone, review) => {
      clone.querySelector('[data-key="gameName"]').textContent = review.expand?.game?.name || '(unknown)';
      clone.querySelector('[data-key="contents"]').innerHTML = review.contents; // Assuming contents is trusted HTML from editor
      clone.querySelector('[data-key="meta"]').textContent = [
        review.platform,
        new Date(review.created).toLocaleDateString(),
        review.visibility,
        review.tier ? `Tier ${review.tier}` : null,
      ].filter(Boolean).join(' • ');
    },
  });
}

async function loadGames() {
  const target = $('#games-target');
  if (!pb.authStore.isValid) {
    renderMessage(target, 'Sign in to load games.');
    return;
  }
  if (state.games) {
    return renderGames(); // Use cached data
  }

  renderMessage(target, 'Loading games...');
  try {
    const res = await pb.collection('games').getList(1, 50, { sort: 'name' });
    state.games = res.items || [];
    renderGames();
  } catch (e) {
    console.error(e);
    renderMessage(target, 'Failed to load games.');
  }
}

function renderGames() {
  const target = $('#games-target');
  if (!state.games?.length) {
    renderMessage(target, 'No games found.');
    return;
  }

  renderItems({
    target,
    items: state.games,
    template: templates.gameRow,
    onClone: (clone, game) => {
      clone.querySelector('[data-key="name"]').textContent = game.name;
      clone.querySelector('[data-key="external_id"]').textContent = game.external_id;
      clone.querySelector('[data-key="created"]').textContent = new Date(game.created).toLocaleDateString();
    },
  });
}

function updateAuthUI() {
  const loggedIn = pb.authStore.isValid;
  document.body.dataset.authState = loggedIn ? 'logged-in' : 'logged-out';
  $('#authStatus').textContent = loggedIn ? `Logged in as ${pb.authStore.model.email}` : 'Logged out';

  // Clear games data on logout
  if (!loggedIn) {
    state.games = null;
    const gamesSection = $('#section-games');
    if (gamesSection.classList.contains('active')) {
      renderMessage($('#games-target'), 'Sign in to load games.');
    }
  }
}

function showSection(sectionId) {
  $$('.section').forEach(s => s.classList.remove('active'));
  const section = $(`#section-${sectionId}`);
  if (section) {
    section.classList.add('active');
    history.replaceState({}, '', `#${sectionId}`);

    // Load data for the active section
    if (sectionId === 'reviews') loadReviews();
    if (sectionId === 'games') loadGames();
  }
}

function setupEventListeners() {
  $('#loginBtn').addEventListener('click', async () => {
    try {
      await pb.collection('users').authWithPassword($('#email').value, $('#password').value);
      updateAuthUI();
      if (location.hash === '#games') loadGames();
    } catch (e) {
      alert('Login Failed.');
      console.error(e);
    }
  });

  $('#logoutBtn').addEventListener('click', () => {
    pb.authStore.clear();
    updateAuthUI();
  });

  $('#nav').addEventListener('click', (e) => {
    const link = e.target.closest('a[data-section]');
    if (link) {
      e.preventDefault();
      showSection(link.dataset.section);
    }
  });
}

function init() {
  // Hit counter
  const counterEl = $('#counter');
  const key = 'pantheon_hits';
  const n = (parseInt(localStorage.getItem(key) || '0', 10) + 1);
  localStorage.setItem(key, String(n));
  counterEl.textContent = String(n).padStart(6, '0');

  // Initial setup
  updateAuthUI();
  setupEventListeners();
  const initialSection = (location.hash || '#reviews').slice(1);
  showSection(initialSection);
}

init();

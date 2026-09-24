/* Site behaviour. Add and edit posts in content/posts.js, not in this file. */
(() => {
  const site = window.SITE || {};
  const posts = [...(window.POSTS || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const formatDate = (date, options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) => new Intl.DateTimeFormat('en-GB', options).format(new Date(date)).replace(',', ' ·');
  const postUrl = (post) => `#post/${encodeURIComponent(post.id)}`;

  document.title = `${site.name || 'Notes'} — notes`;
  $$('[data-site-name]').forEach((node) => node.textContent = site.name || 'Notes');
  $$('[data-site-handle]').forEach((node) => node.textContent = site.handle || 'notes');
  $('[data-entry-count]').textContent = `${posts.length} ${posts.length === 1 ? 'entry' : 'entries'}`;

  function createCard(post) {
    const fragment = $('#post-card-template').content.cloneNode(true);
    const link = $('[data-post-link]', fragment);
    link.href = postUrl(post);
    $('[data-post-date]', fragment).textContent = formatDate(post.date).toUpperCase();
    $('[data-post-body]', fragment).textContent = post.body;
    return fragment;
  }
  function renderCards(target, items) {
    target.replaceChildren();
    if (!items.length) { target.innerHTML = '<p class="empty-state">Nothing here yet.</p>'; return; }
    items.forEach((post) => target.append(createCard(post)));
  }
  function renderArchive() {
    const target = $('[data-archive-list]'); target.replaceChildren();
    [...new Set(posts.map((post) => new Date(post.date).getFullYear()))].forEach((year) => {
      const heading = document.createElement('h2'); heading.className = 'archive-year'; heading.textContent = year; target.append(heading);
      posts.filter((post) => new Date(post.date).getFullYear() === year).forEach((post) => {
        const link = document.createElement('a'); link.className = 'archive-item'; link.href = postUrl(post);
        link.innerHTML = `<time>${formatDate(post.date, { day: '2-digit', month: 'short' }).toUpperCase()}</time><span></span>`;
        $('span', link).textContent = post.body; target.append(link);
      });
    });
  }
  function showView(name) {
    $$('.view').forEach((view) => view.classList.toggle('is-visible', view.dataset.view === name));
    $$('[data-view-link]').forEach((link) => link.classList.toggle('is-active', link.dataset.viewLink === name));
    if (name === 'search') window.setTimeout(() => $('[data-search-input]').focus(), 80);
  }
  function showPost(id) {
    const post = posts.find((item) => item.id === id);
    if (!post) { location.hash = '#timeline'; return; }
    $('[data-post-page]').replaceChildren();
    const date = document.createElement('time'); date.textContent = formatDate(post.date).toUpperCase();
    const body = document.createElement('p'); body.className = 'post-full-text'; body.textContent = post.body;
    $('[data-post-page]').append(date, body); showView('post');
  }
  function route() {
    const route = decodeURIComponent(location.hash.slice(1) || 'timeline');
    route.startsWith('post/') ? showPost(route.slice(5)) : showView(['timeline', 'dev-log', 'search', 'archive'].includes(route) ? route : 'timeline');
    window.scrollTo(0, 0);
  }

  renderCards($('[data-post-list]'), posts);
  renderCards($('[data-dev-log-list]'), posts.filter((post) => post.category === 'dev'));
  renderArchive();
  const search = $('[data-search-input]');
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase('en');
    const results = posts.filter((post) => post.body.toLocaleLowerCase('en').includes(query));
    $('[data-search-note]').textContent = query ? `${results.length} result${results.length === 1 ? '' : 's'} found.` : 'Start typing to search.';
    renderCards($('[data-search-list]'), query ? results : []);
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { search.value = ''; search.dispatchEvent(new Event('input')); search.blur(); } });
  $('[data-random]').addEventListener('click', () => { if (posts.length) location.hash = postUrl(posts[Math.floor(Math.random() * posts.length)]); });

  const composer = $('[data-composer]'); const composerInput = $('[data-composer-input]'); const composerNote = $('[data-composer-note]');
  composer.addEventListener('submit', async (event) => {
    event.preventDefault(); const draft = composerInput.value.trim();
    if (!draft) { composerNote.textContent = 'Write something first.'; composerInput.focus(); return; }
    try { await navigator.clipboard.writeText(draft); composerNote.textContent = 'Draft copied. Open the GitHub file to publish it.'; }
    catch { composerNote.textContent = 'Copy the draft, then open content/posts.js on GitHub to publish it.'; }
    if (site.postsEditorUrl) window.setTimeout(() => window.open(site.postsEditorUrl, '_blank', 'noopener'), 350);
  });
  composerInput.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') composer.requestSubmit(); });

  const toggle = $('.theme-toggle');
  const setTheme = (theme) => { document.documentElement.dataset.theme = theme; localStorage.setItem('theme', theme); toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); };
  setTheme(localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  toggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  window.addEventListener('hashchange', route); route();
})();

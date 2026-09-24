/*
 * Uygulama davranışları burada bulunur.
 * İçerik eklemek için app.js'i değiştirmeyin; content/posts.js dosyasını kullanın.
 */
(() => {
  const site = window.SITE || {};
  const posts = [...(window.POSTS || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  const locale = site.language === 'tr' ? 'tr-TR' : 'en-US';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  document.documentElement.lang = site.language || 'tr';
  document.title = `${site.name || 'Notlar'} — kişisel notlar`;
  $$('[data-site-name]').forEach((node) => node.textContent = site.name || 'Notlar');
  $$('[data-site-handle]').forEach((node) => node.textContent = site.handle || 'notlar');
  $('[data-entry-count]').textContent = `${posts.length} ${posts.length === 1 ? 'entry' : 'entries'}`;

  const formatDate = (date, options = { day: '2-digit', month: 'short', year: 'numeric' }) =>
    new Intl.DateTimeFormat(locale, options).format(new Date(date)).replaceAll('.', '');
  const postUrl = (post) => `#post/${encodeURIComponent(post.id)}`;

  function createCard(post) {
    const fragment = $('#post-card-template').content.cloneNode(true);
    const link = $('[data-post-link]', fragment);
    link.href = postUrl(post);
    $('[data-post-date]', fragment).textContent = formatDate(post.date).toUpperCase();
    $('[data-post-title]', fragment).textContent = post.title;
    $('[data-post-excerpt]', fragment).textContent = post.excerpt || '';
    return fragment;
  }

  function renderCards(target, items) {
    target.replaceChildren();
    if (!items.length) {
      target.innerHTML = '<p class="empty-state">Burada henüz bir kayıt yok.</p>';
      return;
    }
    items.forEach((post) => target.append(createCard(post)));
  }

  function renderArchive() {
    const target = $('[data-archive-list]');
    target.replaceChildren();
    const years = [...new Set(posts.map((post) => new Date(post.date).getFullYear()))];
    years.forEach((year) => {
      const heading = document.createElement('h2');
      heading.className = 'archive-year';
      heading.textContent = year;
      target.append(heading);
      posts.filter((post) => new Date(post.date).getFullYear() === year).forEach((post) => {
        const link = document.createElement('a');
        link.className = 'archive-item';
        link.href = postUrl(post);
        link.innerHTML = `<time>${formatDate(post.date, { day: '2-digit', month: 'short' }).toUpperCase()}</time><span></span>`;
        $('span', link).textContent = post.title;
        target.append(link);
      });
    });
  }

  // Güvenli, küçük bir metin biçimlendirme katmanı: paragraf, başlık, bağlantı ve kod desteklenir.
  function escapeHtml(text) {
    return text.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
  }
  function formatInline(text) {
    return escapeHtml(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  }
  function formatContent(content = '') {
    return content.trim().split(/\n\s*\n/).map((block) => {
      if (block.startsWith('## ')) return `<h2>${formatInline(block.slice(3))}</h2>`;
      if (block.startsWith('```') && block.endsWith('```')) return `<pre><code>${escapeHtml(block.slice(3, -3).trim())}</code></pre>`;
      return `<p>${formatInline(block).replaceAll('\n', '<br>')}</p>`;
    }).join('');
  }

  function showView(name) {
    $$('.view').forEach((view) => view.classList.toggle('is-visible', view.dataset.view === name));
    $$('[data-view-link]').forEach((link) => link.classList.toggle('is-active', link.dataset.viewLink === name));
    if (name === 'search') window.setTimeout(() => $('[data-search-input]').focus(), 80);
  }
  function showPost(id) {
    const post = posts.find((item) => item.id === id);
    if (!post) { location.hash = '#timeline'; return; }
    $('[data-post-page]').innerHTML = `<time>${formatDate(post.date).toUpperCase()}</time><h1>${escapeHtml(post.title)}</h1><div class="post-body">${formatContent(post.content)}</div>`;
    showView('post');
  }
  function route() {
    const route = decodeURIComponent(location.hash.slice(1) || 'timeline');
    if (route.startsWith('post/')) showPost(route.slice(5));
    else showView(['timeline', 'dev-log', 'search', 'archive'].includes(route) ? route : 'timeline');
    window.scrollTo(0, 0);
  }

  renderCards($('[data-post-list]'), posts);
  renderCards($('[data-dev-log-list]'), posts.filter((post) => post.category === 'dev'));
  renderArchive();

  const input = $('[data-search-input]');
  input.addEventListener('input', () => {
    const query = input.value.trim().toLocaleLowerCase(locale);
    const results = posts.filter((post) => `${post.title} ${post.excerpt} ${post.content}`.toLocaleLowerCase(locale).includes(query));
    $('[data-search-note]').textContent = query ? `${results.length} sonuç bulundu.` : 'Aramak için yazmaya başla.';
    renderCards($('[data-search-list]'), query ? results : []);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { input.value = ''; input.dispatchEvent(new Event('input')); input.blur(); }
  });
  $('[data-random]').addEventListener('click', () => {
    if (posts.length) location.hash = postUrl(posts[Math.floor(Math.random() * posts.length)]);
  });

  const toggle = $('.theme-toggle');
  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Açık temayı aç' : 'Koyu temayı aç');
  };
  setTheme(localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  toggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  window.addEventListener('hashchange', route);
  route();
})();

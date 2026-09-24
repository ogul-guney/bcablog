/* The protected, single-purpose endpoint that appends public posts to GitHub. */
const json = (body, status = 200, origin = '') => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' } });
const toBase64 = (text) => btoa(unescape(encodeURIComponent(text)));
const fromBase64 = (text) => decodeURIComponent(escape(atob(text.replace(/\n/g, ''))));
const allowedOrigin = (request, env) => request.headers.get('Origin') === env.ALLOWED_ORIGIN ? env.ALLOWED_ORIGIN : '';
async function github(path, env, options = {}) {
  return fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`, { ...options, headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${env.GITHUB_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28', ...options.headers } });
}
async function appendPost(post, env) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const current = await github('content/posts.json', env, { headers: { 'Cache-Control': 'no-cache' } });
    if (!current.ok) throw new Error('GitHub could not read the post archive.');
    const file = await current.json();
    const nextPosts = [post, ...JSON.parse(fromBase64(file.content))];
    const update = await github('content/posts.json', env, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `post: ${post.id}`, content: toBase64(`${JSON.stringify(nextPosts, null, 2)}\n`), sha: file.sha, branch: env.GITHUB_BRANCH }) });
    if (update.ok) return;
    if (update.status !== 409) throw new Error('GitHub could not save the post.');
  }
  throw new Error('Another post was saved at the same time. Please try again.');
}
export default { async fetch(request, env) {
  const origin = allowedOrigin(request, env);
  if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' } });
  if (!origin) return json({ error: 'This request is not allowed.' }, 403);
  if (new URL(request.url).pathname !== '/posts' || request.method !== 'POST') return json({ error: 'Not found.' }, 404, origin);
  try {
    const payload = await request.json(); const body = typeof payload.body === 'string' ? payload.body.trim() : '';
    if (!body) return json({ error: 'Write something first.' }, 400, origin);
    if (body.length > 500) return json({ error: 'Posts must be 500 characters or fewer.' }, 400, origin);
    const post = { id: `post-${crypto.randomUUID()}`, date: new Date().toISOString(), body, category: 'note' };
    await appendPost(post, env); return json({ post }, 201, origin);
  } catch (error) { return json({ error: error.message || 'Unable to publish this post.' }, 500, origin); }
} };

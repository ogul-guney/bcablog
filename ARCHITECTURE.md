# Architecture map

```text
GitHub Pages site → Cloudflare Worker → GitHub content/posts.json → GitHub Pages
```

- The site never contains a GitHub token.
- `worker/src/index.js` is the only file allowed to write to GitHub.
- `content/posts.json` is the source of truth for every post.
- `worker/wrangler.toml` contains public configuration only.
- `GITHUB_TOKEN` is a Cloudflare secret; never add it to a code file or commit it.

The Worker intentionally has no database, framework, build step, or dependency beyond Wrangler. A future AI should preserve this boundary and should not move `GITHUB_TOKEN` into `content/site.js`, `assets/app.js`, or any GitHub-tracked file.

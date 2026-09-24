# Personal stream for GitHub Pages

This site is a static personal timeline, not a conventional article blog. Every post is text-only.

## Publish a post

1. Open `content/posts.js` on GitHub.
2. Click the pencil icon.
3. Copy an existing object and edit `id`, `date`, and `body`.
4. Click **Commit changes**.
5. GitHub Pages updates the public site automatically within a few minutes.

The composer on the website copies a draft and opens this file; static GitHub Pages cannot commit visitor input directly to a repository.

## File map

- `content/posts.js`: post text and dates
- `content/site.js`: site name, handle, and GitHub edit URL
- `assets/styles.css`: visual design
- `assets/app.js`: timeline, search, archive, theme, and composer behaviour

Keep the following folder structure when uploading to GitHub:

```text
index.html
.nojekyll
assets/styles.css
assets/app.js
content/site.js
content/posts.js
```

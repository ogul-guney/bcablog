# Personal stream — setup

This project uses a GitHub Pages site plus one small Cloudflare Worker. The Worker creates a GitHub commit whenever someone presses **Post**.

## 1. Upload the website to GitHub

Upload these items from the project root to the root of `ogul-guney/bcablog`:

```text
index.html
.nojekyll
assets/
content/
```

Do not upload the `worker` folder into the Pages site unless you also want to keep the Worker source in the same repository. It does not affect the public page either way.

## 2. Create a GitHub token

Create a fine-grained personal access token for only the `bcablog` repository. Give it only this permission:

```text
Repository permissions → Contents → Read and write
```

Set a short expiry. Copy the token once; it will be stored in Cloudflare, never in the project files.

## 3. Deploy the Worker

Open a terminal inside the `worker` folder and run:

```text
npm install
npx wrangler login
npx wrangler secret put GITHUB_TOKEN
npx wrangler deploy
```

When asked for the secret value, paste the GitHub token. The last command prints a URL like `https://bcablog-posts.YOUR-SUBDOMAIN.workers.dev`.

## 4. Connect the website

Open `content/site.js`. Replace this value:

```js
postApiUrl: 'https://REPLACE-WITH-YOUR-WORKER.workers.dev/posts'
```

with the Worker URL from step 3 and keep `/posts` at the end. Commit this one-file change to GitHub.

## Files to edit later

- `content/posts.json`: initial posts or manual corrections.
- `content/site.js`: site name, handle, and Worker URL.
- `assets/styles.css`: visual design.
- `assets/app.js`: browser-side interaction.
- `worker/src/index.js`: the protected GitHub-writing endpoint.

Never place `GITHUB_TOKEN` in any file or commit it. It belongs only in the Cloudflare Worker secret.

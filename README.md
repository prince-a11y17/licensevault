# LicenseVault – Software License Manager

A small front-end web app to record software licenses (software, vendor, key, seats, expiry date)
and see which ones are active, expiring within 30 days, or expired.

## Features
- Add, delete and renew (+1 year) licenses
- Status tags: Active / Expiring soon / Expired, with summary counts
- Search by software or vendor, filter by status
- License keys are masked in the table (only the last 4 characters show)
- Duplicate-key check and input validation
- Data saved in the browser (localStorage); responsive layout

## Tech
HTML5, CSS3, JavaScript (ES6). No frameworks or backend.

## Run locally
Open `index.html` in a browser.

## Deploy with GitHub Pages
1. Create a new public repository and upload these four files.
2. Settings → Pages → Source: "Deploy from a branch" → `main` / `(root)` → Save.
3. Your site appears at `https://<your-username>.github.io/<repo-name>/`.

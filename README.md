# Silverado Ranch LLC — Inventory Site

A React-powered inventory page that reads live from a Google Sheet.
The owner manages their inventory through a Google Form — no coding required.

---

## How It Works

```
Owner fills Google Form → data appears in Google Sheet → site reads Sheet → page updates
```

No database. No backend server. No monthly hosting fees beyond a domain.

---

## Setup: Google Sheet

### 1. Create the Sheet

Create a new Google Sheet with these exact column headers in Row 1:

| Column | Description | Example |
|--------|-------------|---------|
| Year | Model year | 2018 |
| Make | Brand | GMC |
| Model | Model name | Sierra 1500 |
| Trim | Trim level | SLE Double Cab |
| Type | Car / SUV / Truck / Van | Truck |
| Drivetrain | FWD / AWD / 4x4 / RWD | 4x4 |
| Engine | Engine size | 5.3L V8 |
| Mileage | Miles (no "mi") | 155,000 |
| Price | Numbers only, no $ or commas | 19950 |
| Status | Available / Pending / Sold | Available |
| Features | Comma-separated list | Navigation, Heated Seats, Backup Camera |
| Photos | URL of the main/hero photo | https://... |
| VIN | Full VIN | 1GTV2MEC0JZ208046 |
| PhotoCount | How many photos exist | 9 |

### 2. Name the tab "Inventory"

Click the tab at the bottom of Google Sheets and rename it to exactly: `Inventory`

### 3. Publish the Sheet

1. File → Share → Publish to web
2. Select the **Inventory** tab
3. Select **CSV** format
4. Click **Publish**
5. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/**THIS_PART**/edit`

### 4. Add the Sheet ID to the code

Open `src/useInventory.js` and replace:
```js
const SHEET_ID = 'YOUR_SHEET_ID_HERE'
```
with your actual Sheet ID.

---

## Setup: Google Form (for the owner)

Create a Google Form with fields matching each column above.
Link it to the Google Sheet (Responses → Link to Sheets).

**Tip:** Make "Status" a dropdown with options: Available, Pending, Sold.

Give the owner a bookmark to the form. That's their entire CMS.

---

## Photo Hosting

Owner uploads photos to a shared **Google Drive folder**.
Right-click any photo → Get link → change to "Anyone with the link can view."
Paste that URL into the Photos column of the Sheet.

Alternatively, use any image host (Imgur, Cloudflare Images, etc.)

---

## Local Development

```bash
npm install
npm run dev
```

The site runs on `http://localhost:5173`

During development (when SHEET_ID is still `YOUR_SHEET_ID_HERE`),
the app uses built-in sample data so you can work without a live Sheet.

---

## Deploying to GitHub Pages

1. In `vite.config.js`, set the base path to your repo name:
   ```js
   base: '/silverado-inventory/'
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy the `dist/` folder to GitHub Pages.
   Easiest method — install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
   Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```
   Then run:
   ```bash
   npm run build && npm run deploy
   ```

4. In your GitHub repo → Settings → Pages → set source to `gh-pages` branch.

---

## Pointing the Domain

If the owner wants `silveradoranchllc.com/inventory` to show this page,
add a CNAME record in their domain's DNS pointing to your GitHub Pages URL.

Or host on Netlify (free tier) and point a subdomain:
`inventory.silveradoranchllc.com`

---

## Ongoing Maintenance (your retainer)

Monthly tasks to keep the site healthy:
- Monitor that Google Sheet is still publishing (it can expire)
- Update sold vehicles and remove stale listings
- Add new inventory when the owner submits via the form
- Refresh photos if they go stale

Suggested retainer: $50–75/month

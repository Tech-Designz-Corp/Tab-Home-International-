# Tabitha's Home International, Inc. — Website

A static website for **Tabitha's Home International, Inc.**, a Christian ministry serving women, children, and families. The official mission and vision are on the Home and About pages.

> _"Unto the Least of These"_

## ✨ Highlights

- **Premium, ministry-driven design** — soft white, deep navy, light sky blue, and gentle watercolor accents inspired by the logo.
- **Fully responsive** for desktop, tablet, and mobile. Page content stays visible without JavaScript.
- **Automated information guide** with links to site pages. It is not a staffed chat.
- **Keyboard focus styles** and reduced-motion support. This is not a WCAG certification.
- **Zero build step** — pure HTML, CSS, and JavaScript. Just open `index.html`.

## 📄 Pages

| Page | File |
|------|------|
| Home | `index.html` |
| About | `about.html` |
| Programs | `programs.html` |
| Join the Launch | `live.html` |
| Account | `account.html` |
| Member Sign-Up | `member-signup.html` |
| Donate | `donate.html` |
| Newsletter | `newsletter.html` |
| Contact | `contact.html` |
| Privacy | `privacy.html` |
| Terms of Service | `terms.html` |

## 🗂️ Structure

```
.
├── index.html              # Home
├── about.html
├── programs.html
├── member-signup.html
├── donate.html
├── newsletter.html
├── contact.html
├── live.html
├── privacy.html
├── terms.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js             # Navigation, footer, guide, forms, donation link
│   ├── site-config.js      # Form and donation switches
│   ├── live-config.js      # Launch status
│   └── live.js             # Countdown and Zoom join link
└── assets/
    └── Logo.png            # Required brand file. See PLACE-LOGO-HERE.txt
```

Navigation, the footer, and the information guide are injected by `js/main.js`. A short navigation list is also in each page for visitors without JavaScript.

## Live site

The intended host is Vercel at `www.tabithashomeintl.org`. Member accounts and form submissions use TiDB Serverless on port 4000. See `RELEASE.md` before publishing. Do not treat a push to `main` as a production deploy. GitHub Pages is not the production host.

## 🚀 Running the site

Simply open `index.html` in any modern browser.

For the cleanest experience (so all relative paths resolve), serve the folder
with any static server, for example:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

## 🖼️ Logo

Place the supplied logo at **`assets/Logo.png`**. Pages reference that path only.
A text "T" can show if the image fails to load. `node scripts/check-site.js` still fails while the file is missing.

## 📝 Forms & Payments

Forms and donations stay closed until `js/site-config.js` has a real HTTPS form endpoint or hosted checkout URL. Closed pages show the published email and do not pretend a message or gift was received. Card numbers are never collected here.

## 🎨 Customizing

- **Colors / fonts / spacing** → CSS variables at the top of `css/styles.css` (`:root`).
- **Navigation, footer, and guide replies** → `js/main.js`.
- **Form and donation switches** → `js/site-config.js`.
- **Launch status** → `js/live-config.js`. A countdown does not mark the event live.

## 🔗 Connect

- Facebook: https://www.facebook.com/p/Tabithas-Home-for-Women-and-Children-100067544006813/
- Instagram: https://www.instagram.com/tabithashome.tt/
- Website: https://tabithas-home.org/

---

© 2026 Tabitha's Home International, Inc. All Rights Reserved.

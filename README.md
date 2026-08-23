# Tabitha's Home International, Inc. — Website

A modern, beautiful, faith-centered website for **Tabitha's Home International, Inc.**, a ministry dedicated to restoring, empowering, and transforming the lives of women and children through compassion, dignity, refuge, and faith-centered support.

> _"Unto the Least of These"_

## ✨ Highlights

- **Premium, ministry-driven design** — soft white, deep navy, light sky blue, and gentle watercolor accents inspired by the logo.
- **Fully responsive** for desktop, tablet, and mobile, with smooth scrolling and soft scroll-reveal animations.
- **Floating chatbot** — _Tabitha Assistant_ — with quick-reply buttons (Become a Member, Donate Now, Request Assistance, Volunteer, Contact Us, Newsletter Sign-Up, Prayer Request).
- **Accessible** — semantic HTML, keyboard-focus styles, reduced-motion support, and readable color contrast.
- **Zero build step** — pure HTML, CSS, and JavaScript. Just open `index.html`.

## 📄 Pages

| Page | File |
|------|------|
| Home (Hero, About, Core Values, Programs, CTA, Stories, Newsletter, Contact) | `index.html` |
| About | `about.html` |
| Programs & Initiatives | `programs.html` |
| Member Sign-Up | `member-signup.html` |
| Donate | `donate.html` |
| Newsletter | `newsletter.html` |
| Contact Us | `contact.html` |

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
├── css/
│   └── styles.css          # Full design system + responsive styles
├── js/
│   ├── main.js             # Shared navbar, footer, chatbot, interactions
│   └── content.js          # Core Values / Programs / Stories data
└── assets/
    └── Logo.png            # ← add your logo here (see PLACE-LOGO-HERE.txt)
```

The navbar, footer, and chatbot are defined **once** in `js/main.js` and injected
into every page (into the `#site-header`, `#site-footer`, and `#site-chatbot`
placeholders), so updating navigation or branding is done in a single place.

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

Place your logo at **`assets/Logo.png`**. Every page references it automatically.
A graceful fallback shows an elegant "T" monogram if the file is missing, so the
site never appears broken. See `assets/PLACE-LOGO-HERE.txt`.

## 📝 Forms & Payments

All forms (newsletter, contact, membership, donation) are functional **front-end
mockups** with validation and success states — no data is sent and **no real
payments are processed**. They are ready to connect to your backend or a service:

- **Forms** → Formspree, Netlify Forms, or your own endpoint.
- **Donations** → Stripe, PayPal, Donorbox, or Givebutter (secure placeholders
  are already in place on the Donate page).

## 🎨 Customizing

- **Colors / fonts / spacing** → CSS variables at the top of `css/styles.css` (`:root`).
- **Navigation, footer links, chatbot replies, contact info** → `BRAND`, `NAV`,
  and `CHAT_REPLIES` in `js/main.js`.
- **Core Values / Programs / Stories** → arrays in `js/content.js`.

## 🔗 Connect

- Facebook: https://www.facebook.com/p/Tabithas-Home-for-Women-and-Children-100067544006813/
- Instagram: https://www.instagram.com/tabithashome.tt/
- Website: https://tabithas-home.org/

---

© 2026 Tabitha's Home International, Inc. All Rights Reserved.

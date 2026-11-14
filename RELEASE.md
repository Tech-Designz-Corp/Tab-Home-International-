# Release note — November 14, 2026

**Decision: no-go for production until PlanetScale, the Zoom link, and DNS are connected.**

The account pages, form API, and Zoom join page are in the project. Donations stay closed. Nothing in this build was deployed. Production still needs a PlanetScale database with `sql/schema.sql` applied, the PlanetScale host and password in Vercel environment variables, a `QUERY_TOKEN`, the domain `www.tabithashomeintl.org`, and a Zoom URL in `js/live-config.js` before the join button can appear.

This folder is not a git repository, so there is no tested commit SHA. The check below was run against the working files.

## What is ready

- Home and About use the CEO mission and vision verbatim.
- Named programs link to their own sections. The page does not claim those services have open spaces.
- Unverified stories and the placeholder phone number are gone.
- The launch clock is 6:00 p.m. Eastern on November 14, 2026 (7:00 p.m. in Tobago). The countdown does not switch the page to Live.
- With no Facebook URL, the player stays off and the status says Unavailable.
- Contact, membership, and newsletter forms are not on the page. The published email is `info@tabithashomeintl.org`.
- Donate does not collect card numbers and does not say a gift was completed.
- The information guide is labeled automated. It does not say staff are online.
- A privacy page describes this static site. It is not a security certification.
- `.nojekyll` is present so GitHub Pages can skip Jekyll. The August Jekyll error itself was not reproduced.

## Still required before a full go

1. Create the PlanetScale database, apply `sql/schema.sql` on the `main` branch, and copy the host, username, password, and database name into Vercel. Add a separate `QUERY_TOKEN`. Do not commit those values.
2. Paste the public Zoom join URL into `js/live-config.js`, set `enabled` to true, and set `status` to `scheduled`. Do not mark it `live` until the meeting is actually open.
3. Point `www.tabithashomeintl.org` at the Vercel project. Online giving stays closed until a hosted checkout URL exists.
4. Re-run `node scripts/check-site.js`, then deploy with Vercel only after those values exist.

## Operator runbook

Edit `js/live-config.js` and publish the site again. Caching can delay the change.

| When | Set `status` to | What visitors see |
|---|---|---|
| Before the meeting, with a Zoom URL and `enabled: true` | `scheduled` | The time, the countdown, and a button that opens Zoom. |
| The meeting is actually open | `live` | The same Zoom button and a note that an operator marked it open. |
| The meeting drops | `interrupted` | The Zoom button and an interruption note. |
| The meeting is over | `ended` | An ended message and no join button. |
| The URL is missing or should be hidden | `unavailable` and `enabled: false` | No join button and no sample meeting. |

Do not set `live` because the clock reached 6:00 p.m.

## Check results

Command: `node scripts/check-site.js`  
Exit code: **0**

| Result | Item |
|---|---|
| Pass | `assets/Logo.png` is the cropped supplied mark. The uncropped screenshot is `assets/logo-source.jpg` and is not part of the Pages package. |
| Pass | JavaScript syntax, official mission and vision, no demo success text, no local `file:///` logo path, forms and donations explicitly disabled, livestream explicitly unavailable, one h1 and no duplicate static ids per page, meta Content-Security-Policy present, program anchors, privacy page |
| Note | `style-src` includes `'unsafe-inline'` because some elements still use style attributes |
| Pending | Real HTTP headers. GitHub Pages does not send a CSP header, `frame-ancestors`, `Permissions-Policy`, or HSTS. The meta tag is not those headers. |
| Not run by the script | Screen reader, measured contrast, Lighthouse, a real Facebook broadcast, a real checkout, a deployed HTTPS request, and a git-history secret scan |
| Manual browser pass | Home, About, Programs `#shaped`, Donate, and Live on a local server. Status stayed Unavailable. Donate stated that online giving is not open. The guide opened, answered Request Assistance without promising staff contact, and Escape returned focus to the button. No form and no iframe were present on those pages. After the logo file was added, the header and homepage show that mark instead of the text T. |

Workflow file: `.github/workflows/site-checks.yml`. It runs the check on pull requests. A Pages deploy job exists for a push to `main` only. This work did not push or deploy. Action versions are tags, not pinned commit SHAs.

## Rollback

There is no new production deploy to roll back. If a later Pages deploy is bad, redeploy the previous Pages artifact from the repository's deployment history and confirm the public pages no longer show the bad release.

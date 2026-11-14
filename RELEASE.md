# Release note — November 14, 2026

**Decision: no-go for production until the TiDB connection settings and DNS are connected.**

The account pages, form API, and Zoom join page are in the project. Donations stay closed. Nothing in this build was deployed. Production still needs a TiDB Serverless database with `sql/schema.sql` applied, the TiDB host, port `4000`, username, password, and database name `tabithas_home` in Vercel environment variables, and a separate `QUERY_TOKEN`. The domain `www.tabithashomeintl.org` still needs to point at Vercel. The Zoom join URL is already in `js/live-config.js`. Do not mark the meeting live until it is actually open.

## What is ready

- Home and About use the CEO mission and vision verbatim.
- Named programs link to their own sections. The page does not claim those services have open spaces.
- Unverified stories and the placeholder phone number are gone.
- The launch clock is 6:00 p.m. Eastern on November 14, 2026 (7:00 p.m. in Tobago). The countdown does not switch the page to Live.
- The Zoom join link is connected and the status stays Scheduled. The countdown does not mark the meeting live.
- Contact, membership, and newsletter forms post to the API. They stay unavailable until the TiDB settings exist. The published email is `info@tabithashomeintl.org`.
- Donate does not collect card numbers and does not say a gift was completed.
- The information guide is labeled automated. It does not say staff are online.
- A privacy page describes this static site. It is not a security certification.
- `.nojekyll` is present so GitHub Pages can skip Jekyll. The August Jekyll error itself was not reproduced.

## Still required before a full go

1. Create a TiDB Serverless cluster, run `sql/schema.sql` in its SQL editor, and copy the host, port `4000`, username, password, and database name `tabithas_home` into Vercel. Add a separate `QUERY_TOKEN`. Do not commit those values.
2. Keep `js/live-config.js` enabled, on the Zoom URL, and `scheduled`. Do not mark it `live` until the meeting is actually open.
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

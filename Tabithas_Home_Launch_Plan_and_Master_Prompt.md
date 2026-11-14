# Tabitha’s Home International — launch plan and implementation prompt

Prepared for Zeke / Tech Designz Corp • November 14, 2026

**Release assessment: not ready for a full production launch in its current state.** The branding changes are straightforward, but forms and donations are demonstrations, the assistance chatbot implies a staff connection it does not have, and the livestream is absent. The latest recorded GitHub Pages run failed. Use the release conditions below before announcing the site as fully operational.

**Target:** November 14, 2026, at 2:00 p.m. The event timezone still needs confirmation. Miami and Tobago are one hour apart on this date: 2:00 p.m. Miami is 3:00 p.m. Tobago; 2:00 p.m. Tobago is 1:00 p.m. Miami. Do not publish a countdown until this is resolved.

## 1. What was reviewed and tested

- All seven supplied HTML pages, `main(2).js`, `content.js`, `styles(1).css`, and `README(1).md`.
- Text extracted from all 33 slides of `TAB Promo Vid 2025.pptx`, plus visual inspection of the CEO’s supplied logo, `IMG_5162.jpeg`.
- The connected repository: [Tech-Designz-Corp/Tab-Home-International-](https://github.com/Tech-Designz-Corp/Tab-Home-International-), branch `main`, commit `1a1479099c3bca76b1a73ea4b137b20001320ef9`.
- All 11 uploaded website text files match the corresponding repository blobs exactly after mapping the upload filenames back to their intended paths. This establishes that these findings apply to that repository commit.

| Check actually performed | Result and limit |
|---|---|
| `node --check` on both JavaScript files | Passed. Syntax validation does not establish functional correctness. |
| Static parsing of all seven HTML pages | One H1 and no duplicate static IDs per page. All six page-authored forms omit `action` and `method`; the shared footer adds another form implementation. No livestream iframe was present. |
| Original `main.js` executed in a Node VM with a minimal DOM stub | Valid submission: default submission prevented, form reset, success displayed, zero outgoing requests. Invalid submission: validation reported, no reset, no success. This is an isolated behavior check, not a browser test. |
| Repository structure and asset references | `asset/Logo.png` exists; the primary image and favicon reference, `assets/Logo.png`, does not. JavaScript has a secondary image fallback, but the favicon does not. |
| GitHub Actions history and job steps | Latest recorded run failed at “Build with Jekyll”; deploy was skipped. An earlier run at the same commit succeeded. These runs are dated August 23, 2026. |
| Browser/end-to-end checks | Attempted, but Chromium could not start because the execution environment denied a required socket operation. Responsive appearance, visual contrast, browser behavior and real delivery remain unverified. |
| New CI/CD execution, security scan and production deployment | Not performed. No repository changes, workflow reruns or deployment were made during this planning review. |

The [failed run](https://github.com/Tech-Designz-Corp/Tab-Home-International-/actions/runs/32665681906) and [earlier successful run](https://github.com/Tech-Designz-Corp/Tab-Home-International-/actions/runs/32665652368) are deployment history, not evidence of application tests. The repository tree has no checked-in test suite, package manifest or `.github/workflows` pipeline. The exact Jekyll error was not available through the permitted connector endpoints; do not invent its cause.

## 2. Findings that must shape the implementation

| Priority | Evidence | Required resolution |
|---|---|---|
| Launch blocker | `js/main.js:332–352` handles every form locally and shows success without delivering anything. Donation success text implies a completed gift. | Connect each enabled form to a tested service and each enabled donation route to an approved payment provider. Otherwise remove submission controls and state availability honestly. |
| Launch blocker | `js/main.js:161` invites assistance details and promises staff follow-up; line 185 says “Online.” The assistant is a local canned-reply widget. | Label it as an automated information guide, remove follow-up promises, and provide a verified assistance route. Do not collect sensitive case details in this widget. |
| Launch blocker for the event | No livestream player, stream configuration or event page exists. No public event URL was supplied. | Add and rehearse a provider-hosted embedded stream, public fallback link, and honest scheduled/live/ended/unavailable states. |
| Launch blocker | Latest Pages run failed; README still names the previous repository owner. | Identify the actual production host/domain, repair the release pipeline, and verify the public deployment of the tested commit. |
| Required branding correction | Old mission and vision appear on both Home and About. Logo paths disagree and the JS fallback contains a developer’s local Windows file URL. | Apply the CEO’s exact statements, use a canonical logo asset, remove the local path, and update metadata and shared components. |
| Required content review | Three testimonial quotes are described as real, with names changed. Verification and publication consent were not supplied. | Publish only confirmed, approved testimonials; otherwise remove that section for launch. |
| Required safeguarding review | Deck includes children’s photographs, historic need statistics, contact/payment details and a mixture of current/future programs. | Confirm current services and publication permissions. Do not automatically publish the presentation or its embedded media and financial details. |
| Required accessibility/reliability work | Donation amount/payment selectors are clickable `div`s; program cards all link to `programs.html`, including on that same page; essential content/navigation depends on JS; `.reveal` hides content by default. | Use semantic controls, meaningful program destinations, static essential content, keyboard support and graceful script-failure behavior. |
| Required privacy/security work | No supplied privacy page, explicit POST form actions or production header configuration. No server component is present. | Add accurate notices and safe form handling; verify headers on the actual host. If JS fails, sensitive form data must not fall back to a GET URL. |

The public `tabithas-home.org` page retrieved during this review also showed the previous mission and vision. That retrieval may be cached; it does not establish current DNS, domain ownership or deployment configuration. Confirm the intended launch URL directly.

## 3. Content and design direction

Use the supplied CEO logo as the approved identity: blue house roof, script “Tabitha’s,” “HOME,” the “INTERNATIONAL” ribbon, and “UNTO THE LEAST OF THESE.” This is a replacement of the old website artwork, not permission to invent a different mark. The supplied file is a screenshot with large black bars and surrounding white space. Obtain an original high-resolution/vector asset when available. A faithful crop of the supplied artwork is an acceptable temporary asset; do not redraw the lettering, add symbols or change the wording. Show the full mark on the homepage and use a legible, proportionate treatment in navigation and footer.

Use navy and blue from the mark, white and soft neutral backgrounds, restrained decoration and readable typography. Keep Christian identity explicit while describing people with dignity. Prefer “women, children and families facing abuse, hardship or instability” over labels that define people by trauma. The broader CEO mission must not become an unsupported promise that every service is available to every person immediately.

**CEO-approved Vision — preserve exactly:**

> To see every vulnerable person empowered to live with hope and dignity, providing them the opportunity to reach their God-given potential.

**CEO-approved Mission — preserve exactly:**

> To empower individuals and families to overcome adversity through holistic, compassionate care that restores dignity, builds resilience, and inspires hope.

The presentation supports a more specific organizational story and program inventory:

| Presentation evidence | Appropriate website use, subject to current confirmation |
|---|---|
| Slide 2: established in 2019; faith-based organization in Tobago; Tabitha/Dorcas inspiration | Concise history and Christian foundation. Verify the current legal name and permitted location detail. |
| Slides 6–10: outreach, counseling, food, rental assistance, transitional housing, SHAPED, Hope for Tomorrow | Program descriptions that distinguish operating services from planned initiatives. |
| Slides 10–16: Daughters of the King, Tabitha’s Kids Club, Tabitha’s Kloset, Tabitha’s Kitchen, pantry | Named program cards with useful detail or anchored sections, after current status is confirmed. |
| Slides 21–28: building development and housing units | Dated history only, unless management confirms current availability. No unverified bed or shelter-capacity claims. |
| Slide 5: historical statistics and statements about shelters | Exclude from launch copy until source, geography, date and current accuracy are verified. |
| Slides 29–32: partners and giving instructions | Publish only current approved partnerships, payment destinations and contacts. Do not infer tax deductibility or transfer historical banking details automatically. |

## 4. Launch sequence and ownership

Let **T** mean the confirmed event start. These are readiness checkpoints, not a promise that unfinished work can fit the remaining time.

| When | Owner | Concrete completion condition |
|---|---|---|
| Immediately, ideally T−120 min or earlier | Zeke + CEO + event operator | Confirm timezone, production URL, approved identity/content, broadcaster and watch URL, existing donation account, monitored contact route, and media permissions. Test the broadcast account’s ability to go live now. |
| Before T−60 min | Zeke | Implement branding, mission/vision, livestream and functional fixes on a release branch. Produce a reviewable preview and a list of unresolved dependencies. |
| T−60 min | Zeke + CEO | Freeze discretionary design changes. Review factual content, payment destination and safeguarding. Run the complete release tests. |
| By T−30 min, only if gates pass | Zeke | Deploy the tested artifact/commit, retain the previous release, then check real HTTPS pages, forms, donation routes and playback on the public URL. |
| T−15 min | Event operator + Zeke | Confirm camera, microphone, actual audio/video playback, captions where supported, primary/backup connection, external watch link and failure messaging. |
| T / event period | Event operator + Zeke | Operator controls the broadcast. Monitor player availability and site errors; use the fallback notice or rollback if required. Do not display “Live” just because the clock reached T. |
| After the event | Event operator + CEO + Zeke | End the live status, publish only an approved replay, update event wording and review any failed submissions or errors. |

**Full launch gate:** every advertised feature works; content is approved; the actual event stream plays on the production site; critical paths pass; no unresolved critical/high findings affect the release; a tested rollback exists.

**Reduced launch option:** if the team needs the public information site online while integrations remain unfinished, explicitly agree on that smaller scope. Hide unavailable forms/payment controls, provide a confirmed contact route, and describe the broadcast accurately. It is not a full-feature launch. If an embedded event cannot be tested, an external watch link may be a contingency but does not satisfy the requested on-site playback.

YouTube is a viable option only if the organization’s channel is already able to stream and the event permits embedding. Google warns that first-time activation may take up to 24 hours. Prefer the organization’s already working provider for this same-day event; a website embed cannot activate a broadcast account or transmit a camera feed by itself.

## 5. Copy-ready master implementation prompt

Copy everything between **PROMPT START** and **PROMPT END** into the coding assistant working in the actual repository. Supply the attached logo and presentation as reference inputs.

**PROMPT START**

You are the senior engineer responsible for preparing Tabitha’s Home International’s existing website for a production release and its official launch event. Work from the real repository and supplied files. Implement, test and document the changes. Do not call the release production-ready merely because the pages render or a deployment job succeeds.

### Objective and source authority

Preserve the fast, responsive HTML/CSS/JavaScript architecture unless a specific requirement needs an external service. Prepare a polished Christian nonprofit site centered on hope, dignity, compassionate care, women and children, and the broader individuals-and-families mission below. Add direct on-site viewing of the official launch livestream.

The intended event date is November 14, 2026, at 2:00 p.m.; the timezone is UNCONFIRMED. Confirm the timezone and public event URL before publishing a countdown or event timestamp. If this prompt is used after that date, confirm the new event details rather than reusing the old launch date.

Use this authority order: the CEO-approved mission, vision and logo supplied below; current confirmed organizational facts; the presentation as dated historical/program background; then existing website copy. Do not overwrite new CEO statements with the presentation’s older statements.

Repository discovered during review: `Tech-Designz-Corp/Tab-Home-International-`, `main`. Reviewed baseline: `1a1479099c3bca76b1a73ea4b137b20001320ef9`. Inspect the current branch and instructions before editing; preserve newer work. Upload aliases map as follows: `index(5).html` → `index.html`; `about(1).html` → `about.html`; `main(2).js` → `js/main.js`; `content.js` → `js/content.js`; `styles(1).css` → `css/styles.css`; `README(1).md` → `README.md`. Do not deploy the upload aliases as page routes.

Inspect existing deployment behavior before pushing: `main` may publish automatically. Work in a release branch and prepare a preview. Follow the user’s deployment authorization and existing environment protections; a request to prepare a prompt or plan alone is not production deployment authorization.

### Exact brand content

Vision:
“To see every vulnerable person empowered to live with hope and dignity, providing them the opportunity to reach their God-given potential.”

Mission:
“To empower individuals and families to overcome adversity through holistic, compassionate care that restores dignity, builds resilience, and inspires hope.”

Preserve these statements verbatim on Home and About. Update summaries in the footer, metadata and assistant so they align without presenting paraphrases as the official statements. Keep operational eligibility and service availability separate from the broad mission.

Use the CEO-supplied blue roof-and-script logo and its “UNTO THE LEAST OF THESE” tagline. Replace the old assets consistently in header, homepage, About, footer, favicon and social previews. Preserve proportions and logo wording. Remove screenshot bars/margins faithfully or use the original artwork; retain the source master. Do not generate a substitute logo or invent a vector recreation. Any simplified favicon must derive from an approved brand element and be reviewed at small sizes. Use explicit image dimensions and appropriate alt text.

Choose one canonical asset path; fix the `asset` versus `assets` mismatch and remove the developer-local `file:///` fallback. A text fallback may remain for resilience but must not conceal missing production assets from tests.

### Page experience and content

Retain and improve Home, About, Programs, Member Sign-Up, Donate, Newsletter and Contact. Add `live.html` and a prominent homepage event section with “Watch the Launch” navigation. Add a privacy page and a clear assistance/contact explanation appropriate to the actual services.

Use the blue/navy identity, ample white space, readable body text and restrained effects. Make Request Assistance, Watch the Launch, Donate and Volunteer easy to locate without crowding the mobile screen. Ensure live navigation and the assistant do not cover essential controls. Preserve essential content and navigation if JavaScript fails; reveal animations should enhance already-visible content.

Use confirmed details from the presentation for named programs such as SHAPED, Daughters of the King, Tabitha’s Kids Club, Tabitha’s Kloset, Tabitha’s Kitchen and Hope for Tomorrow. Confirm which are active, planned or historical. Give program cards real detail destinations rather than sending every card back to the same page. Do not invent outcomes, statistics, endorsements, services, staff availability, tax status or partner relationships. Remove unverified testimonials until authenticity and publication consent are established.

### Livestream implementation

Use the organization’s existing approved broadcast provider. The website displays the provider’s stream; it must not expose an ingest URL/stream key, operate a new streaming server, or request visitors’ camera/microphone access. Confirm the event is embeddable and visible to the intended audience from a signed-out device. Do not assume a new account will be enabled in time.

Centralize public event configuration in a small validated file/module, for example `js/live-config.js`: enabled flag, title, provider, public video/event ID, watch URL, ISO start time with offset, IANA timezone, manual operational status, replay ID/URL and public status message. Secrets belong only in the broadcast system or protected server environment. Missing configuration must render an honest unavailable/scheduled message, never a sample broadcast.

Support scheduled, live, interrupted/unavailable, ended and replay states. A countdown reaching zero must not claim the event is live. For today, a documented operator-controlled status in the release configuration is acceptable. Explain its publication/caching behavior. If provider APIs are used, keep required secrets server-side, validate their responses, and handle rate limits/outages. Distinguish a player’s playback state from whether the broadcast itself is live.

Provide a responsive player, accessible iframe title, fullscreen and playback controls, no forced audible autoplay, captions when supported, an always-available external watch link, and retry/help messaging. Do not cover provider controls. For YouTube, respect its minimum player dimensions, use supported privacy-enhanced embedding when appropriate, and use provider-compatible referrer/origin settings; test embedding restrictions and errors including missing client identification. Do not rely on a cross-origin iframe’s load event as proof that the stream is playing. If reliable error detection is unavailable, keep the external link and operator outage notice visible.

Treat “live feed” as the event video. Add an announcements feed only if requested; never invent live updates or visitor counts. Public chat should remain off unless the organization assigns a moderator and approves the experience. Do not broadcast confidential shelter locations, intake conversations or unconsented beneficiaries. Review participation/media permission, especially for children, before adding footage or replay.

### Forms, assistance, newsletter and donations

Replace `wireForms()` demo behavior. A valid browser form is not a delivered submission. Every enabled form needs a real approved endpoint/provider, explicit transport, server-side validation, spam controls and a tested receipt/storage/delivery path. Show pending/success/failure states accurately. Preserve safe user input on recoverable errors, prevent double submissions, and never clear a form before confirmed acceptance. Separate “request received” from “staff contacted you,” and distinguish newsletter confirmation-pending from completed subscription.

Use minimal data collection, accurate privacy information, optional separate marketing consent, and provider-supported unsubscribe. Assistance intake should ask only for necessary contact information and a safe contact preference; avoid collecting abuse narratives or children’s identifying data in a general marketing form. Do not automatically email sensitive message bodies or include them in logs, analytics, URLs or browser storage. Ensure a JavaScript failure cannot submit private fields as a GET query. If a form service is not ready, replace the form with a verified contact method and clear availability information.

Keep Tabitha Assistant as an explicitly automated information guide unless a real staffed service has been integrated and tested. Remove “Online” and promises that a care team will contact the visitor from this local chatbot. Preserve safe text rendering with `textContent`. Do not encourage disclosures, claim emergency monitoring or fabricate advice. Link to the verified assistance route and accurately state monitoring hours. A quick-exit feature may be included if useful, with a clear explanation that it does not erase browser history.

Use an organization-approved hosted donation checkout/link or the provider’s supported integration. Confirm receiving organization, currency (USD/TTD as actually supported), one-time/recurring options and enabled funds. Remove unsupported payment methods and do not infer availability of Zelle or any other option from its presence in the mockup. Never collect raw card numbers/CVV on this static site. Never claim payment completion from a button click or return URL alone. Let hosted checkout provide authoritative confirmation, or verify payment status server-side with signed webhooks and idempotency if maintaining local records. Test cancellation, failure, duplicate attempts and recurring terms using the provider’s test mode. Do not initiate a real charge without explicit authorization.

### Security and privacy requirements

Review controls against the actual architecture and record applicable, verified, pending and not-applicable items. This site currently has no server or login system; do not add unnecessary accounts, databases or authentication to manufacture a security feature list.

- Keep API credentials, broadcast stream keys, payment secrets, private service data and `.env` files out of client assets, commits, logs and build artifacts. Scan the candidate and relevant history with a maintained tool; redact findings and rotate any confirmed exposed credential.
- Use HTTPS and inspect deployed response headers. Configure a tested CSP for the actual scripts, styles, fonts, forms, frames and connections. Refactor inline code/styles as needed; avoid broad wildcards and `unsafe-eval`. Use text-safe rendering and strict provider URL/ID allowlists for any dynamic content. Test allowed embeds and legitimate forms under the policy.
- Apply suitable anti-framing, MIME-sniffing, referrer and permissions policies at a host/edge that can actually send them. Restrict camera/microphone access because visitors only watch. Plan HSTS only after HTTPS/domain configuration is verified. Do not claim a static `_headers` file or meta tag sets headers the host does not support; CSP `frame-ancestors` requires header delivery. Avoid a blanket no-referrer setting that breaks the selected player.
- Protect real form endpoints with validation, size limits, abuse/rate controls and narrow CORS where applicable. If cookie-authenticated state-changing endpoints exist, test CSRF defenses and secure cookie settings. CORS is not authentication. Add authorization/session controls only where an actual protected service exists.
- Restrict repository/deployment access, use MFA for operator accounts, minimize CI token permissions, and prevent untrusted pull requests from accessing deployment secrets. Pin reviewed Actions to immutable revisions or use supported dependency locking. Audit any added dependencies with a lockfile and record findings that affect the release.
- Publish a truthful privacy notice covering actual form, payment, livestream and analytics providers, retention, contact and consent practices. Restrict staff access to submissions. Do not deploy session replay or message-content analytics on assistance pages.
- Keep safeguarding controls concrete: consent for stories/media, safe location disclosure, moderated public interactions and a documented way to remove accidentally exposed material.

### Testing and CI/CD

Create a reproducible quality pipeline suitable for a static site. Keep production simple; add only justified development/test dependencies. Fix the existing Pages failure based on actual logs. Inspect whether static artifact deployment avoids an unnecessary Jekyll path; do not rerun a deploy job and call that an application test.

Run checks on pull requests and the candidate release. Fail the gate for broken critical paths, missing required assets, misleading form/payment success, exposed secrets, or unresolved critical/high findings that affect the deployed scope. Save commands, exit codes, reports and exact commit SHA. A tool that could not run is “blocked,” never “passed.”

Required checks:

1. JavaScript syntax/lint, HTML/CSS validation, local links/anchors, expected assets, duplicate IDs after rendering, missing pages, stale mission/vision and placeholder data. Test both project-subpath deployment and the intended production URL.
2. Browser journeys across all seven existing pages plus Live/privacy: desktop/mobile navigation, logo, program links, keyboard operation, assistant open/close/focus, valid/invalid form states, endpoint failure/timeout, duplicate prevention, newsletter consent and provider checkout success/cancel/failure. Mocked flows do not replace at least one controlled real-provider integration check.
3. Livestream scheduled/live/unavailable/ended/replay behavior, unknown or invalid IDs, refused embedding, blocked third-party content and slow connection. Perform a real audio/video rehearsal through the production embed with the event operator and a separate viewer device.
4. Automated accessibility checks plus manual keyboard/focus, zoom, text contrast, accessible field groups, error announcements and screen-reader labels. Use native buttons/radios for amount and payment choices. Target WCAG 2.2 AA; document any remaining gap rather than claiming certification.
5. Responsive and performance checks at narrow mobile, tablet and desktop sizes, with reduced motion, slow network and script failure. Optimize the logo/media, reserve image/player dimensions, and avoid loading a 54 MB presentation as page content. Record the measurement conditions; do not invent Lighthouse or Core Web Vitals results.
6. Secrets/dependency review, deployed HTTPS/CSP/header checks, safe input rendering and applicable endpoint protections. Mark penetration testing and any checks not actually completed separately.

Recommended pipeline: source checks → automated integration/browser/accessibility checks → package an allowlisted static artifact → preview/release verification → authorized production deployment of the tested artifact → production smoke check. Deploy only website assets; exclude source presentation, original uploads, personal data, reports, tests and secrets. Retain the previous known-good artifact and document a rollback with verification steps. Do not silently bypass required checks to meet 2:00 p.m.

### Delivery and release decision

Return the changed-file summary, working preview, exact tested commit, test results with pass/fail/blocked/not-run distinctions, provider configuration instructions without secrets, remaining dependencies, livestream operator runbook, deployment/rollback instructions, and a clear go/no-go assessment.

A full launch requires verified branding/content, working enabled services, production playback, completed critical-path tests and no unresolved critical/high findings affecting the release. If dependencies prevent this, prepare the safest working scope and explicitly identify which features must stay unavailable. Continue independent implementation while waiting for configuration, but do not fabricate stream links, contacts, payment destinations, test results or authorization.

**PROMPT END**

## 6. Inputs to resolve before production

1. Does 2:00 p.m. mean **Miami/Eastern** or **Tobago/Atlantic** time?
2. What is the **public livestream event URL**, which provider is already enabled, and who will operate the broadcast?
3. Which **domain and host** are launching, and does the GitHub repository currently publish to that destination?
4. Which **approved donation account/link and currency** should be used, and where should contact/membership/newsletter submissions be delivered?
5. Is an **original logo asset** available, and which stories, photographs, program details and contact information are approved for public use?

Provide public configuration and account names, not passwords, payment secrets or stream keys in chat.

## 7. Reference links

- [Reviewed repository commit](https://github.com/Tech-Designz-Corp/Tab-Home-International-/commit/1a1479099c3bca76b1a73ea4b137b20001320ef9)
- [Shared form and assistant code at the reviewed commit](https://github.com/Tech-Designz-Corp/Tab-Home-International-/blob/1a1479099c3bca76b1a73ea4b137b20001320ef9/js/main.js)
- [Existing public website](https://tabithas-home.org/)
- [GitHub Pages: creating a site and server-side limitations](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)
- [YouTube live encoder setup and first activation timing](https://support.google.com/youtube/answer/2907883?hl=en)
- [YouTube embedded player API, dimensions and error handling](https://developers.google.com/youtube/iframe_api_reference)
- [OWASP Content Security Policy guidance](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

This is a reviewed launch plan and implementation brief. It does not certify the website as secure, operational or deployed.

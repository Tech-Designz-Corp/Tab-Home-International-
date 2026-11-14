"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const failures = [];
const passes = [];
const notes = [];

function pass(message) { passes.push(message); }
function fail(message) { failures.push(message); }
function note(message) { notes.push(message); }

const pages = [
  "index.html",
  "about.html",
  "programs.html",
  "member-signup.html",
  "donate.html",
  "newsletter.html",
  "contact.html",
  "live.html",
  "privacy.html",
  "account.html"
];

const mission = "To empower individuals and families to overcome adversity through holistic, compassionate care that restores dignity, builds resilience, and inspires hope.";
const vision = "To see every vulnerable person empowered to live with hope and dignity, providing them the opportunity to reach their God-given potential.";
const csp = "default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src 'none'; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; form-action 'self'; media-src 'none'";

const forbidden = [
  ["file:///", "local file URL"],
  ["(000) 000-0000", "placeholder phone"],
  ["000-0000", "placeholder phone"],
  ["Thank you for subscribing", "demo newsletter success"],
  ["generous gift", "demo donation success"],
  ["We'll be in touch", "unverified staff follow-up"],
  ["care team", "staffed assistant promise"],
  ["Names have been changed", "unverified testimonial"],
  ["here to help", "assistant presence claim"],
  ["Zelle", "unapproved payment method"],
  ["To restore, empower, and transform the lives of women and children who have been violated", "retired mission"],
  ["To be a beacon of hope and a place of refuge where women and children who have been abused", "retired vision"],
  ["asset/Logo.png", "non-canonical logo path"],
  ["js/content.js", "removed story renderer"]
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function isHttps(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password;
  } catch (e) {
    return false;
  }
}

function isZoomLink(value) {
  if (!isHttps(value)) return false;
  const host = new URL(value).hostname.toLowerCase();
  return host === "zoom.us" || host.endsWith(".zoom.us");
}

function loadWindowConfig(rel) {
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(read(rel), sandbox, { filename: rel });
  return sandbox.window;
}

function checkSyntax(rel) {
  try {
    execFileSync(process.execPath, ["--check", path.join(root, rel)], { stdio: "pipe" });
    pass("syntax " + rel);
  } catch (error) {
    fail("syntax " + rel + " " + (error.stderr ? error.stderr.toString() : error.message));
  }
}

function localRefs(file, text) {
  const re = /\b(?:href|src)="([^"]+)"/g;
  let match;
  while ((match = re.exec(text))) {
    const raw = match[1];
    if (/^(https?:|mailto:|tel:)/i.test(raw)) continue;
    if (raw.startsWith("#")) {
      const id = raw.slice(1);
      if (id && !new RegExp("\\sid=\"" + id + "\"").test(text) && !new RegExp("\\sid='" + id + "'").test(text)) {
        fail(file + " missing same-page anchor " + raw);
      }
      continue;
    }
    if (raw.startsWith("/")) {
      fail(file + " uses a root-absolute URL " + raw);
      continue;
    }
    const hashAt = raw.indexOf("#");
    const pathPart = hashAt === -1 ? raw : raw.slice(0, hashAt);
    const hash = hashAt === -1 ? "" : raw.slice(hashAt + 1);
    const target = path.resolve(path.dirname(path.join(root, file)), pathPart);
    if (!target.startsWith(root)) {
      fail(file + " escapes the site " + raw);
      continue;
    }
    if (!fs.existsSync(target)) {
      const normalized = pathPart.replace(/\\/g, "/");
      if (normalized === "assets/Logo.png" || normalized.endsWith("/assets/Logo.png")) continue;
      fail(file + " missing local target " + raw);
      continue;
    }
    if (hash) {
      const dest = fs.readFileSync(target, "utf8");
      if (!new RegExp("\\sid=\"" + hash + "\"").test(dest)) fail(file + " missing #" + hash + " in " + pathPart);
    }
  }
}

["js/site-config.js", "js/live-config.js", "js/main.js", "js/live.js", "js/account.js", "scripts/check-site.js"].forEach(checkSyntax);
function addJs(dir) {
  fs.readdirSync(path.join(root, dir)).forEach(function (name) {
    const rel = dir + "/" + name;
    const full = path.join(root, rel);
    if (fs.statSync(full).isDirectory()) addJs(rel);
    else if (name.endsWith(".js")) checkSyntax(rel);
  });
}
addJs("api");
addJs("server");

const sourceFiles = [];
function addTree(dir) {
  fs.readdirSync(path.join(root, dir)).forEach(function (name) {
    const rel = dir + "/" + name;
    const full = path.join(root, rel);
    if (fs.statSync(full).isDirectory()) addTree(rel);
    else if (/\.(html|css|js)$/.test(name)) sourceFiles.push(rel);
  });
}
["js", "css", "api", "server"].forEach(addTree);
pages.forEach(function (page) { sourceFiles.push(page); });

const combined = sourceFiles.map(function (rel) { return read(rel); }).join("\n");
forbidden.forEach(function (pair) {
  if (combined.includes(pair[0])) fail("found " + pair[1] + ": " + pair[0]);
  else pass("absent " + pair[1]);
});

if (fs.existsSync(path.join(root, "js", "content.js"))) fail("js/content.js should stay removed");
else pass("story renderer removed");

if (fs.existsSync(path.join(root, "_headers"))) fail("_headers must not be presented as a GitHub Pages header control");
else pass("no _headers file");

if (fs.existsSync(path.join(root, ".nojekyll"))) pass(".nojekyll present");
else fail(".nojekyll missing");

if (fs.existsSync(path.join(root, ".github", "workflows", "site-checks.yml"))) pass("workflow file present");
else fail("workflow file missing");

const logo = path.join(root, "assets", "Logo.png");
if (!fs.existsSync(logo)) fail("assets/Logo.png is missing");
else if (fs.statSync(logo).size < 1000) fail("assets/Logo.png is too small to be the brand mark");
else pass("assets/Logo.png present");

const site = loadWindowConfig("js/site-config.js").SITE_CONFIG;
const live = loadWindowConfig("js/live-config.js").LIVE_CONFIG;
if (!site) fail("SITE_CONFIG missing");
if (!live) fail("LIVE_CONFIG missing");

if (site && site.email !== "info@tabithashomeintl.org") fail("contact email changed without a new confirmation");
else pass("published contact email unchanged");

if (site && site.formsEnabled !== true) {
  fail("forms must be enabled for the account release");
} else if (site && site.formEndpoint !== "/api/forms") {
  fail("form endpoint must be /api/forms");
} else if (site) {
  pass("forms post to /api/forms");
}

if (site && site.donationsEnabled !== true) {
  if (site.donationsEnabled !== false || site.donationUrl !== "") fail("donations are neither disabled nor configured");
  else pass("donations explicitly disabled");
} else if (site && !isHttps(site.donationUrl)) {
  fail("donationsEnabled requires an HTTPS checkout URL");
} else if (site) {
  const currencyOk = site.donationCurrency === "" || site.donationCurrency === "USD" || site.donationCurrency === "TTD";
  if (!currencyOk) fail("donation currency must be empty, USD, or TTD");
  else pass("donation checkout URL is HTTPS");
}

if (live) {
  if (live.provider !== "zoom") fail("live provider must be zoom");
  if (live.start !== "2026-11-14T18:00:00-05:00") fail("live start must stay 2026-11-14T18:00:00-05:00");
  if (live.timezone !== "America/New_York") fail("live timezone must be America/New_York");
  if (live.enabled !== true) {
    if (live.enabled !== false || live.status !== "unavailable" || live.videoUrl || live.watchUrl || live.replayUrl) {
      fail("livestream is neither explicitly unavailable nor fully configured");
    } else pass("livestream explicitly unavailable");
  } else {
    const needsLink = live.status === "live" || live.status === "interrupted" || live.status === "scheduled";
    if (needsLink && !isZoomLink(live.watchUrl)) fail("live status " + live.status + " needs a Zoom join URL");
    else if (live.videoUrl) fail("zoom configuration must not include a video URL");
    else if (live.replayUrl) fail("zoom configuration must not include a replay URL");
    else if (!["scheduled", "live", "interrupted", "ended", "replay", "unavailable"].includes(live.status)) fail("unknown live status");
    else pass("livestream configuration is allowlisted");
  }
}

const mainJs = read("js/main.js");
const liveJs = read("js/live.js");
if (mainJs.indexOf("form.reset()") !== -1 && mainJs.indexOf("form.reset()") < mainJs.indexOf('if (!res.ok) throw new Error("status")')) {
  fail("form.reset runs before a confirmed response");
} else pass("form reset is only on a successful response");
if (!mainJs.includes('form.method = "post"')) fail("enabled forms do not set method post");
else pass("enabled forms set method post");
if (!liveJs.includes("Reaching zero will not mark the event live.")) fail("countdown can be read as a live claim");
else pass("countdown text does not claim the event is live");
if (/cfg\.status\s*=\s*["']live["']/.test(liveJs)) fail("player script assigns live status");
else pass("player script does not assign live status");
if (/iframe/i.test(liveJs)) fail("launch script builds an iframe");
else pass("launch script does not build an iframe");

const secretRe = /BEGIN (RSA |OPENSSH )?PRIVATE KEY|sk_live_[0-9A-Za-z]|AKIA[0-9A-Z]{16}/;
sourceFiles.forEach(function (rel) {
  if (secretRe.test(read(rel))) fail("possible secret pattern in " + rel);
});
pass("working-tree secret pattern scan completed");

pages.forEach(function (page) {
  if (!fs.existsSync(path.join(root, page))) {
    fail("missing page " + page);
    return;
  }
  const text = read(page);
  const h1 = text.match(/<h1\b/g) || [];
  if (h1.length !== 1) fail(page + " has " + h1.length + " h1 elements");
  else pass(page + " has one h1");

  const ids = [];
  const idRe = /\sid="([^"]+)"/g;
  let idMatch;
  while ((idMatch = idRe.exec(text))) ids.push(idMatch[1]);
  const seen = Object.create(null);
  ids.forEach(function (id) {
    if (seen[id]) fail(page + " duplicate id " + id);
    seen[id] = true;
  });
  if (!ids.some(function (id, index) { return ids.indexOf(id) !== index; })) pass(page + " has no duplicate static ids");

  if (!text.includes('name="referrer" content="strict-origin-when-cross-origin"')) fail(page + " referrer policy missing");
  const cspMatch = text.match(/http-equiv="Content-Security-Policy" content="([^"]*)"/);
  if (!cspMatch) fail(page + " CSP missing");
  else if (cspMatch[1].includes("unsafe-eval") || /script-src[^;]*unsafe-inline/.test(cspMatch[1])) fail(page + " CSP allows unsafe script execution");
  else if (cspMatch[1] !== csp) fail(page + " CSP does not match the site policy");
  else pass(page + " CSP matches the site policy");
  if (cspMatch && cspMatch[1].includes("'unsafe-inline'")) note(page + " style-src allows unsafe-inline because pages use style attributes");

  if (!text.includes('rel="icon" href="assets/Logo.png"')) fail(page + " favicon is not assets/Logo.png");
  if (!text.includes('src="js/site-config.js"') || !text.includes('src="js/main.js"')) fail(page + " missing shared scripts");
  if (!text.includes('class="noscript-nav"')) fail(page + " missing noscript navigation");
  if (/<form[\s>]/i.test(text) && (!site || site.formsEnabled !== true)) fail(page + " contains a form while forms are disabled");
  localRefs(page, text);

  (text.match(/<img\b[^>]*>/g) || []).forEach(function (tag) {
    if (!/\salt="[^"]+"/.test(tag)) fail(page + " image missing alt");
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) fail(page + " image missing width and height");
    if (!tag.includes('src="assets/Logo.png"')) fail(page + " image is not assets/Logo.png");
  });
});

["index.html", "about.html"].forEach(function (page) {
  const text = read(page);
  if (!text.includes(mission)) fail(page + " is missing the official mission");
  else pass(page + " has the official mission");
  if (!text.includes(vision)) fail(page + " is missing the official vision");
  else pass(page + " has the official vision");
});

if (site && site.donationsEnabled !== true && !read("donate.html").includes("Online giving is not open")) {
  fail("donate page does not say online giving is closed");
}
if (site && site.formsEnabled !== true) {
  ["contact.html", "newsletter.html", "member-signup.html"].forEach(function (page) {
    if (!/not open/i.test(read(page))) fail(page + " does not say the form is closed");
  });
}

["shaped", "daughters-of-the-king", "kids-club", "kloset", "kitchen", "hope-for-tomorrow"].forEach(function (id) {
  if (!read("programs.html").includes('id="' + id + '"')) fail("programs.html missing #" + id);
  else pass("programs.html has #" + id);
});

["js/main.js", "js/live.js"].forEach(function (rel) {
  const text = read(rel);
  const re = /["']([a-z0-9-]+\.html)(#[a-z0-9-]+)?["']/g;
  let match;
  while ((match = re.exec(text))) {
    const page = match[1];
    const hash = match[2] ? match[2].slice(1) : "";
    if (!fs.existsSync(path.join(root, page))) fail(rel + " missing page " + page);
    else if (hash && !new RegExp("\\sid=\"" + hash + "\"").test(read(page))) fail(rel + " missing #" + hash + " in " + page);
  }
});

if (!read("privacy.html").includes("Vercel") || !read("privacy.html").includes("session replay") || !read("privacy.html").includes("not end-to-end encryption")) {
  fail("privacy page is missing the host, session-replay, or encryption statement");
} else pass("privacy page names Vercel and the account storage limits");

const apiSql = sourceFiles.filter(function (rel) { return rel.indexOf("api/") === 0 || rel.indexOf("server/") === 0; }).map(read).join("\n");
if (/query\s*\(\s*`[^`]*\$\{/.test(apiSql) || /query\s*\(\s*["'][^"']*["']\s*\+/.test(apiSql) || /execute\s*\(\s*["'][^"']*["']\s*\+/.test(apiSql) || /execute\s*\(\s*`[^`]*\$\{/.test(apiSql)) {
  fail("SQL is built with string concatenation");
} else pass("SQL calls use placeholders");
if (/(MYSQL_PASSWORD|QUERY_TOKEN)\s*[:=]\s*["'][^"']+["']/.test(apiSql + "\n" + read("js/site-config.js") + "\n" + read("js/live-config.js"))) {
  fail("a database password or query token is written into the site");
} else pass("database password and query token are not in the site files");

note("style-src 'unsafe-inline' is a recorded gap, not a claim of a strict style policy.");
note("vercel.json sends the CSP, frame-ancestors, and Permissions-Policy. The meta CSP does not include frame-ancestors.");
note("NOT-RUN browser journeys, screen reader, contrast measurement, Lighthouse, a real Zoom join, hosted checkout, and a PlanetScale connection.");
note("NOT-RUN git history secret scan and a full dependency audit. mysql2 and bcryptjs are the runtime dependencies.");

console.log("PASSES");
passes.forEach(function (item) { console.log("PASS " + item); });
console.log("NOTES");
notes.forEach(function (item) { console.log("NOTE " + item); });
console.log("FAILURES");
if (!failures.length) console.log("none");
failures.forEach(function (item) { console.log("FAIL " + item); });
console.log("RESULT " + (failures.length ? "fail " + failures.length : "pass"));
process.exit(failures.length ? 1 : 0);

/* Account dashboard. Values from the server are written with textContent. */
(function () {
  "use strict";

  var root = document.querySelector("[data-account-root]");
  if (!root) return;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function statusNode() {
    var node = el("p", "form-status", "");
    node.setAttribute("role", "status");
    node.tabIndex = -1;
    return node;
  }

  function when(value) {
    if (!value) return "Not recorded yet.";
    var date = new Date(String(value).replace(" ", "T") + "Z");
    if (isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      dateStyle: "long",
      timeStyle: "short"
    }).format(date);
  }

  function post(url, body) {
    return fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json", "Content-Type": "application/json", "X-Requested-With": "fetch" },
      body: JSON.stringify(body)
    });
  }

  function messageFor(res, fallback) {
    if (res.status === 429) return "Too many attempts. Wait and try again.";
    return res.json().then(function (data) {
      return (data && data.error) || fallback;
    }).catch(function () { return fallback; });
  }

  function renderLogin() {
    root.textContent = "";
    var card = el("div", "card");
    card.appendChild(el("h2", "section-title", "Sign in"));
    var form = el("form", "form");
    form.method = "post";
    form.action = "/api/login";
    var email = field(form, "email", "Email", "email", true);
    var secret = field(form, "password", "Password", "password", true);
    var button = el("button", "btn btn--primary", "Sign in");
    button.type = "submit";
    form.appendChild(button);
    var status = statusNode();
    form.appendChild(status);
    card.appendChild(form);
    card.appendChild(el("p", "form-note", "A forgotten password cannot be reset from this page. Email info@tabithashomeintl.org if you still need access."));
    root.appendChild(card);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      button.disabled = true;
      status.textContent = "Checking the sign-in. This is not a confirmation.";
      post("/api/login", { email: email.value, password: secret.value }).then(function (res) {
        if (!res.ok) {
          button.disabled = false;
          return messageFor(res, "The email or password was not accepted.").then(function (text) {
            status.textContent = text;
          });
        }
        window.location.reload();
      }).catch(function () {
        button.disabled = false;
        status.textContent = "Sign-in is not available.";
      });
    });
  }

  function field(form, name, labelText, type, required) {
    var wrap = el("label", "field");
    wrap.appendChild(el("span", "", labelText));
    var input = el("input", "input");
    input.name = name;
    input.type = type;
    input.required = required;
    if (type === "password") {
      input.minLength = 10;
      input.maxLength = 72;
      input.autocomplete = name === "next" ? "new-password" : "current-password";
    }
    wrap.appendChild(input);
    form.appendChild(wrap);
    return input;
  }

  function stat(list, labelText, value) {
    var row = el("div", "account-stat");
    row.appendChild(el("dt", "", labelText));
    row.appendChild(el("dd", "", value));
    list.appendChild(row);
  }

  function renderDashboard(member) {
    root.textContent = "";
    var card = el("div", "card");
    card.appendChild(el("h2", "section-title", "Your account"));
    var list = el("dl", "account-stats");
    stat(list, "Member since", when(member.createdAt));
    stat(list, "Membership type", member.membershipType || "");
    stat(list, "Last sign-in", when(member.lastLoginAt));
    stat(list, "Email updates", member.marketingConsent ? "On" : "Off");
    card.appendChild(list);
    card.appendChild(el("p", "form-note", member.email || ""));
    var signOut = el("button", "btn btn--accent", "Sign out");
    signOut.type = "button";
    card.appendChild(signOut);
    root.appendChild(card);

    root.appendChild(settingsCard(member));
    root.appendChild(passwordCard());
    root.appendChild(deleteCard());

    signOut.addEventListener("click", function () {
      post("/api/logout", {}).then(function () { window.location.reload(); });
    });
  }

  function settingsCard(member) {
    var card = el("div", "card");
    card.appendChild(el("h2", "section-title", "Account settings"));
    var form = el("form", "form");
    form.method = "post";
    form.action = "/api/account";
    var name = field(form, "name", "Name", "text", true);
    name.maxLength = 120;
    name.value = member.name || "";
    var phone = field(form, "phone", "Phone", "tel", false);
    phone.maxLength = 40;
    phone.required = false;
    phone.value = member.phone || "";
    var consentWrap = el("label", "check");
    var consent = el("input");
    consent.type = "checkbox";
    consent.checked = member.marketingConsent === true;
    consentWrap.appendChild(consent);
    consentWrap.appendChild(document.createTextNode(" I agree to receive email updates."));
    form.appendChild(consentWrap);
    var button = el("button", "btn btn--primary", "Save settings");
    button.type = "submit";
    form.appendChild(button);
    var status = statusNode();
    form.appendChild(status);
    card.appendChild(form);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      button.disabled = true;
      fetch("/api/account", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { Accept: "application/json", "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ name: name.value, phone: phone.value, marketingConsent: consent.checked })
      }).then(function (res) {
        button.disabled = false;
        if (!res.ok) return messageFor(res, "The account was not updated.").then(function (text) { status.textContent = text; });
        status.textContent = "Settings saved.";
        return res.json().then(renderDashboard);
      }).catch(function () {
        button.disabled = false;
        status.textContent = "The account was not updated.";
      });
    });
    return card;
  }

  function passwordCard() {
    var card = el("div", "card");
    card.appendChild(el("h2", "section-title", "Change password"));
    var form = el("form", "form");
    form.method = "post";
    form.action = "/api/password";
    var current = field(form, "current", "Current password", "password", true);
    var next = field(form, "next", "New password", "password", true);
    var button = el("button", "btn btn--primary", "Change password");
    button.type = "submit";
    form.appendChild(button);
    var status = statusNode();
    form.appendChild(status);
    card.appendChild(form);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (next.value.length < 10) {
        status.textContent = "Use a new password of 10 to 72 characters.";
        return;
      }
      button.disabled = true;
      post("/api/password", { currentPassword: current.value, password: next.value }).then(function (res) {
        button.disabled = false;
        if (!res.ok) return messageFor(res, "The password was not changed.").then(function (text) { status.textContent = text; });
        current.value = "";
        next.value = "";
        status.textContent = "Password changed.";
      }).catch(function () {
        button.disabled = false;
        status.textContent = "The password was not changed.";
      });
    });
    return card;
  }

  function deleteCard() {
    var card = el("div", "card");
    card.appendChild(el("h2", "section-title", "Delete account"));
    card.appendChild(el("p", "form-note", "Deletion removes this login and its sessions. It does not close a separate email you already sent."));
    var form = el("form", "form");
    form.method = "post";
    form.action = "/api/delete-account";
    var current = field(form, "current", "Current password", "password", true);
    var button = el("button", "btn btn--primary", "Delete account");
    button.type = "submit";
    form.appendChild(button);
    var status = statusNode();
    form.appendChild(status);
    card.appendChild(form);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      button.disabled = true;
      post("/api/delete-account", { currentPassword: current.value }).then(function (res) {
        if (!res.ok) {
          button.disabled = false;
          return messageFor(res, "The account was not deleted.").then(function (text) { status.textContent = text; });
        }
        window.location.reload();
      }).catch(function () {
        button.disabled = false;
        status.textContent = "The account was not deleted.";
      });
    });
    return card;
  }

  fetch("/api/account", { headers: { Accept: "application/json" }, credentials: "same-origin" })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (member) { if (member) renderDashboard(member); else renderLogin(); })
    .catch(renderLogin);
})();

/* ==========================================================================
   Tabitha's Home International, Inc.
   Shared navigation, footer, automated guide, and optional form/donation links.
   Forms are created only when SITE_CONFIG.formsEnabled is true and the
   endpoint is /api/forms or another HTTPS address.
   ========================================================================== */
(function () {
  "use strict";

  var BRAND = {
    name: "Tabitha's Home",
    sub: "International, Inc.",
    tagline: "Unto the Least of These",
    email: "info@tabithashomeintl.org",
    facebook: "https://www.facebook.com/p/Tabithas-Home-for-Women-and-Children-100067544006813/",
    instagram: "https://www.instagram.com/tabithashome.tt/",
    logo: "assets/Logo.png"
  };

  var NAV = [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Programs", href: "programs.html" },
    { label: "Join the Launch", href: "live.html" },
    { label: "Account", href: "account.html" },
    { label: "Member Sign-Up", href: "member-signup.html" },
    { label: "Donate", href: "donate.html" },
    { label: "Newsletter", href: "newsletter.html" },
    { label: "Contact Us", href: "contact.html" }
  ];

  var ICONS = {
    facebook: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    send: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>'
  };

  function siteConfig() {
    return window.SITE_CONFIG || {};
  }

  function isHttps(value) {
    try {
      var u = new URL(value);
      return u.protocol === "https:" && !u.username && !u.password;
    } catch (e) {
      return false;
    }
  }

  function formsReady() {
    var cfg = siteConfig();
    return cfg.formsEnabled === true && (cfg.formEndpoint === "/api/forms" || isHttps(cfg.formEndpoint));
  }

  function currentPage() {
    var path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function logoMarkup() {
    return (
      '<img class="brand__logo" alt="Tabitha\'s Home International logo, with the words Unto the Least of These" ' +
      'width="500" height="395" data-logo src="' + BRAND.logo + '" />' +
      '<span class="brand__fallback" data-logo-fallback hidden>T</span>'
    );
  }

  function buildHeader() {
    var page = currentPage();
    var links = NAV.map(function (item) {
      var active = item.href === page ? " is-active" : "";
      return '<li><a class="nav__link' + active + '" href="' + item.href + '">' + item.label + "</a></li>";
    }).join("");

    return (
      '<a class="skip-link" href="#content">Skip to content</a>' +
      '<header class="site-header" id="siteHeader">' +
        '<div class="container">' +
          '<nav class="nav" id="primaryNav" aria-label="Primary">' +
            '<a class="brand" href="index.html" aria-label="Tabitha\'s Home International, Inc. home">' +
              logoMarkup() +
              '<span class="brand__text">' +
                '<span class="brand__name">' + BRAND.name + "</span>" +
                '<span class="brand__sub">' + BRAND.sub + "</span>" +
              "</span>" +
            "</a>" +
            '<ul class="nav__links" id="navLinks">' + links +
              '<li class="nav__cta"><a class="btn btn--accent" href="donate.html">Donate</a></li>' +
            "</ul>" +
            '<button class="nav__toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navLinks">' +
              "<span></span><span></span><span></span>" +
            "</button>" +
          "</nav>" +
        "</div>" +
      "</header>"
    );
  }

  function buildFooter() {
    var quick = [
      { label: "Join the Launch", href: "live.html" },
      { label: "Account", href: "account.html" },
      { label: "Become a Member", href: "member-signup.html" },
      { label: "Donate", href: "donate.html" },
      { label: "Volunteer", href: "member-signup.html" },
      { label: "Request Assistance", href: "contact.html" },
      { label: "Newsletter", href: "newsletter.html" },
      { label: "Contact Us", href: "contact.html" },
      { label: "Privacy", href: "privacy.html" },
      { label: "Terms", href: "terms.html" }
    ].map(function (l) { return '<li><a href="' + l.href + '">' + l.label + "</a></li>"; }).join("");

    var explore = [
      { label: "Home", href: "index.html" },
      { label: "About Us", href: "about.html" },
      { label: "Programs", href: "programs.html" },
      { label: "Core Values", href: "index.html#values" },
      { label: "Join the Launch", href: "live.html" },
      { label: "Account", href: "account.html" }
    ].map(function (l) { return '<li><a href="' + l.href + '">' + l.label + "</a></li>"; }).join("");

    var news = formsReady()
      ? '<div data-form-slot="footer-news"></div>'
      : '<p class="footer__mission">Email updates are not open on this site. Use the Newsletter page for the status, or email ' +
        '<a href="mailto:' + BRAND.email + '">' + BRAND.email + "</a>.</p>" +
        '<a class="btn btn--accent" href="newsletter.html">Newsletter</a>';

    return (
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<div class="footer__grid">' +
            "<div>" +
              '<div class="footer__brand">' + logoMarkup() +
                '<span class="brand__text"><span class="brand__name">' + BRAND.name +
                '</span><span class="brand__sub footer__sub">' + BRAND.sub + "</span></span>" +
              "</div>" +
              '<p class="footer__mission">A Christian ministry serving women, children, and families with compassionate care. The official mission and vision are on the About page.</p>' +
              '<div class="socials">' +
                '<a class="social-btn" href="' + BRAND.facebook + '" target="_blank" rel="noopener" aria-label="Facebook">' + ICONS.facebook + "</a>" +
                '<a class="social-btn" href="' + BRAND.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + ICONS.instagram + "</a>" +
              "</div>" +
            "</div>" +
            "<div>" +
              "<h2>Quick Links</h2>" +
              '<ul class="footer__links">' + quick + "</ul>" +
            "</div>" +
            "<div>" +
              "<h2>Explore</h2>" +
              '<ul class="footer__links">' + explore + "</ul>" +
            "</div>" +
            '<div class="footer__news">' +
              "<h2>Stay Connected</h2>" +
              news +
            "</div>" +
          "</div>" +
          '<div class="footer__bottom">' +
            "<span>&copy; 2026 Tabitha's Home International, Inc. All Rights Reserved.</span>" +
            '<a href="privacy.html">Privacy</a>' +
            '<a href="terms.html">Terms</a>' +
            '<span class="footer__tag">\u201C' + BRAND.tagline + "\u201D</span>" +
          "</div>" +
        "</div>" +
      "</footer>"
    );
  }

  var CHAT_QUICK = [
    "Join the Launch", "Become a Member", "Donate Now", "Request Assistance",
    "Volunteer", "Contact Us", "Newsletter Sign-Up"
  ];

  var CHAT_REPLIES = {
    "join the launch": "The join page lists 6:00 p.m. Eastern on November 14, 2026 (7:00 p.m. in Tobago). The page does not call the meeting live only because that time has passed. Open live.html. Zoom opens in a new tab when a join link is connected.",
    "become a member": "The Member Sign-Up page creates an account when the database is connected. After that, the Account page shows your own sign-in details. Email " + BRAND.email + " if the form says it was not delivered.",
    "donate now": "The Donate page explains giving. This site does not collect card numbers. A checkout button appears only when a hosted payment link is connected. Opening that page does not confirm a gift.",
    "request assistance": "This guide cannot take an assistance request or contact staff. Use the Contact page or email " + BRAND.email + ". Share only your name, how to reach you, and a contact preference. Do not include abuse details or children's names. This guide is not monitored for emergencies.",
    "volunteer": "Volunteer interest is one of the membership types on the Member Sign-Up page. Email " + BRAND.email + " if the form says the account was not created.",
    "contact us": "Email " + BRAND.email + " or open the Contact page. The guide itself does not deliver a message to staff.",
    "newsletter sign-up": "The Newsletter page can request email updates. A request is not a completed subscription until the organization confirms it.",
    "default": "This automated guide can point you to the launch, membership, donations, assistance, volunteering, contact, or the newsletter. It cannot contact staff. Do not share case details or children's names."
  };

  function buildChatbot() {
    var quick = CHAT_QUICK.map(function (q) {
      return '<button type="button" data-quick="' + q.toLowerCase() + '">' + q + "</button>";
    }).join("");

    return (
      '<button class="chat-fab" id="chatFab" aria-label="Open the automated information guide" aria-expanded="false" aria-controls="chatPanel">' +
        '<span class="chat-fab__icon">' + ICONS.chat + "</span>" +
        '<span class="chat-fab__label">Information guide</span>' +
      "</button>" +
      '<section class="chat-panel" id="chatPanel" role="dialog" aria-label="Automated information guide" aria-modal="false" hidden>' +
        '<div class="chat-head">' +
          '<div class="chat-head__avatar" aria-hidden="true">T</div>' +
          "<div>" +
            '<div class="chat-head__name">Information guide</div>' +
            '<div class="chat-head__status">Automated guide. Not monitored.</div>' +
          "</div>" +
          '<button class="chat-close" id="chatClose" type="button" aria-label="Close the information guide">\u00D7</button>' +
        "</div>" +
        '<div class="chat-body" id="chatBody" aria-live="polite"></div>' +
        '<div class="chat-quick" id="chatQuick">' + quick + "</div>" +
        '<p class="chat-disclaimer">Do not type case details, abuse narratives, or children\'s names. Leaving this page does not erase browser history.</p>' +
        '<div class="chat-input">' +
          '<label class="visually-hidden" for="chatInput">Question about the website</label>' +
          '<input type="text" id="chatInput" placeholder="Ask where to find a page\u2026" autocomplete="off" maxlength="240" />' +
          '<button class="chat-send" id="chatSend" type="button" aria-label="Send">' + ICONS.send + "</button>" +
        "</div>" +
        '<button class="chat-exit" id="chatExit" type="button">Leave this page</button>' +
      "</section>"
    );
  }

  function wireLogos() {
    document.querySelectorAll("[data-logo]").forEach(function (img) {
      function showFallback() {
        img.style.display = "none";
        var fb = img.parentElement && img.parentElement.querySelector("[data-logo-fallback]");
        if (fb) fb.hidden = false;
      }
      if (img.getAttribute("src") !== BRAND.logo) img.src = BRAND.logo;
      img.addEventListener("error", showFallback);
      if (img.complete && img.naturalWidth === 0) showFallback();
    });
  }

  function wireNav() {
    var nav = document.getElementById("primaryNav");
    var toggle = document.getElementById("navToggle");
    var header = document.getElementById("siteHeader");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.querySelectorAll(".nav__link, .nav__cta a").forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  function wireReveal() {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function wireChat() {
    var fab = document.getElementById("chatFab");
    var panel = document.getElementById("chatPanel");
    var close = document.getElementById("chatClose");
    var body = document.getElementById("chatBody");
    var input = document.getElementById("chatInput");
    var send = document.getElementById("chatSend");
    var quick = document.getElementById("chatQuick");
    var exit = document.getElementById("chatExit");
    if (!fab || !panel || !body) return;

    var greeted = false;
    function addMsg(text, who) {
      var div = document.createElement("div");
      div.className = "chat-msg chat-msg--" + who;
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }
    function answer(text) {
      var key = String(text || "").trim().toLowerCase();
      var reply = CHAT_REPLIES[key];
      if (!reply) {
        Object.keys(CHAT_REPLIES).some(function (k) {
          if (k !== "default" && key.indexOf(k) !== -1) { reply = CHAT_REPLIES[k]; return true; }
          return false;
        });
      }
      window.setTimeout(function () { addMsg(reply || CHAT_REPLIES.default, "bot"); }, 300);
    }
    function open() {
      panel.hidden = false;
      panel.classList.add("is-open");
      fab.classList.add("is-hidden");
      fab.setAttribute("aria-expanded", "true");
      if (!greeted) {
        greeted = true;
        addMsg("This is an automated information guide for Tabitha's Home International. It is not staffed and it is not an emergency service. The official mission and vision are on the About page.", "bot");
      }
      window.setTimeout(function () { if (input) input.focus(); }, 200);
    }
    function hide() {
      panel.classList.remove("is-open");
      panel.hidden = true;
      fab.classList.remove("is-hidden");
      fab.setAttribute("aria-expanded", "false");
      fab.focus();
    }
    function sendText() {
      if (!input) return;
      var val = input.value.trim();
      if (!val) return;
      addMsg(val, "user");
      input.value = "";
      answer(val);
    }

    fab.addEventListener("click", open);
    if (close) close.addEventListener("click", hide);
    if (quick) {
      quick.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-quick]");
        if (!btn) return;
        addMsg(btn.textContent, "user");
        answer(btn.getAttribute("data-quick"));
      });
    }
    if (send) send.addEventListener("click", sendText);
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          sendText();
        }
      });
    }
    if (exit) {
      exit.addEventListener("click", function () {
        window.location.href = "https://www.weather.gov/";
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) hide();
    });
  }

  function field(parent, opts) {
    var wrap = document.createElement("div");
    wrap.className = "field";
    var label = document.createElement("label");
    label.htmlFor = opts.id;
    label.textContent = opts.label;
    wrap.appendChild(label);
    var input;
    if (opts.kind === "textarea") input = document.createElement("textarea");
    else if (opts.kind === "select") input = document.createElement("select");
    else input = document.createElement("input");
    input.id = opts.id;
    input.name = opts.name;
    input.className = opts.kind === "textarea" ? "textarea" : (opts.kind === "select" ? "select" : "input");
    if (opts.type) input.type = opts.type;
    if (opts.required) input.required = true;
    if (opts.maxLength) input.maxLength = opts.maxLength;
    if (opts.minLength) input.minLength = opts.minLength;
    if (opts.type === "password") input.autocomplete = "new-password";
    if (opts.placeholder) input.placeholder = opts.placeholder;
    if (opts.kind === "select") {
      opts.options.forEach(function (item) {
        var opt = document.createElement("option");
        opt.value = item.value;
        opt.textContent = item.label;
        input.appendChild(opt);
      });
    }
    wrap.appendChild(input);
    parent.appendChild(wrap);
    return input;
  }

  function successText(slot) {
    if (slot === "newsletter" || slot === "footer-news" || slot === "home-news") {
      return "Request received. A notice may be emailed. This is not a recurring newsletter, and it does not mean a staff member has contacted you.";
    }
    if (slot === "membership") {
      return "Request received. This does not mean membership is active or that a staff member has contacted you.";
    }
    return "Request received. This does not mean a staff member has contacted you.";
  }

  function buildFields(form, slot) {
    var id = slot.replace(/[^a-z0-9]+/gi, "-");
    if (slot === "newsletter" || slot === "footer-news" || slot === "home-news") {
      if (slot !== "footer-news") field(form, { id: id + "-name", name: "name", label: "Name", type: "text", maxLength: 120 });
      field(form, { id: id + "-email", name: "email", label: "Email", type: "email", required: true, maxLength: 200 });
      var consent = document.createElement("label");
      consent.className = "check";
      var box = document.createElement("input");
      box.type = "checkbox";
      box.name = "marketingConsent";
      box.value = "yes";
      box.required = true;
      consent.appendChild(box);
      consent.appendChild(document.createTextNode(slot === "footer-news"
        ? " I agree to receive email updates."
        : " I agree to receive email updates. This box is separate from any other request."));
      form.appendChild(consent);
      return;
    }
    if (slot === "membership") {
      var types = ["General Member", "Volunteer Member", "Donor Member", "Ministry Partner", "Community Partner", "Prayer Partner"];
      var group = document.createElement("fieldset");
      var legend = document.createElement("legend");
      legend.textContent = "Membership type";
      group.appendChild(legend);
      types.forEach(function (name, index) {
        var label = document.createElement("label");
        label.className = "check";
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "membershipType";
        radio.value = name;
        radio.required = index === 0;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(" " + name));
        group.appendChild(label);
      });
      form.appendChild(group);
    }
    field(form, { id: id + "-name", name: "name", label: "Name", type: "text", required: true, maxLength: 120 });
    field(form, { id: id + "-email", name: "email", label: "Email", type: "email", required: true, maxLength: 200 });
    field(form, { id: id + "-phone", name: "phone", label: "Phone, if you want a call", type: "tel", maxLength: 40 });
    if (slot === "contact" || slot === "home-contact") {
      var pref = document.createElement("fieldset");
      var prefLegend = document.createElement("legend");
      prefLegend.textContent = "Preferred contact";
      pref.appendChild(prefLegend);
      ["Email", "Phone"].forEach(function (name, index) {
        var label = document.createElement("label");
        label.className = "check";
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "contactPreference";
        radio.value = name;
        radio.required = index === 0;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(" " + name));
        pref.appendChild(label);
      });
      form.appendChild(pref);
      field(form, {
        id: id + "-reason",
        name: "reason",
        label: "Reason",
        kind: "select",
        required: true,
        options: [
          { value: "", label: "Select a reason" },
          { value: "Request Assistance", label: "Request assistance" },
          { value: "Volunteer", label: "Volunteer" },
          { value: "Donate", label: "Donate" },
          { value: "Partnership", label: "Partnership" },
          { value: "Prayer Request", label: "Prayer request" },
          { value: "General Question", label: "General question" }
        ]
      });
    }
    if (slot === "membership") {
      field(form, { id: id + "-password", name: "password", label: "Password", type: "password", required: true, minLength: 10, maxLength: 72 });
      field(form, { id: id + "-confirm", name: "confirm", label: "Confirm password", type: "password", required: true, minLength: 10, maxLength: 72 });
      var consent = document.createElement("label");
      consent.className = "check";
      var box = document.createElement("input");
      box.type = "checkbox";
      box.name = "marketingConsent";
      box.value = "yes";
      consent.appendChild(box);
      consent.appendChild(document.createTextNode(" I also agree to receive email updates. Leave this unchecked if you do not."));
      form.appendChild(consent);
      return;
    }
    var warn = document.createElement("p");
    warn.className = "form-note";
    warn.textContent = "Do not include abuse details or children's names. A short note is optional.";
    form.appendChild(warn);
    field(form, { id: id + "-note", name: "note", label: "Optional note", kind: "textarea", maxLength: 1000 });
  }

  function wireForms() {
    var cfg = siteConfig();
    document.querySelectorAll("form").forEach(function (existing) {
      if (!existing.getAttribute("action") || existing.method.toLowerCase() !== "post") {
        existing.remove();
      }
    });
    if (!formsReady()) return;

    document.querySelectorAll("[data-form-slot]").forEach(function (slot) {
      var name = slot.getAttribute("data-form-slot") || "form";
      var form = document.createElement("form");
      form.className = "form";
      form.method = "post";
      form.action = name === "membership" ? "/api/signup" : cfg.formEndpoint;
      form.setAttribute("accept-charset", "UTF-8");
      form.noValidate = false;

      var trapWrap = document.createElement("div");
      trapWrap.className = "hp";
      var trap = document.createElement("input");
      trap.type = "text";
      trap.name = "company";
      trap.tabIndex = -1;
      trap.autocomplete = "off";
      trap.setAttribute("aria-hidden", "true");
      trapWrap.appendChild(trap);
      form.appendChild(trapWrap);

      buildFields(form, name);

      var button = document.createElement("button");
      button.className = "btn btn--primary";
      button.type = "submit";
      button.textContent = name === "membership" ? "Create account" : (name.indexOf("news") !== -1 ? "Request email updates" : "Send request");
      form.appendChild(button);

      var status = document.createElement("p");
      status.className = "form-status";
      status.setAttribute("role", "status");
      status.tabIndex = -1;
      form.appendChild(status);

      if (name !== "footer-news") {
        var mail = document.createElement("p");
        mail.className = "form-note";
        mail.appendChild(document.createTextNode("You can also email "));
        var mailLink = document.createElement("a");
        mailLink.href = "mailto:" + BRAND.email;
        mailLink.textContent = BRAND.email;
        mail.appendChild(mailLink);
        mail.appendChild(document.createTextNode("."));
        form.appendChild(mail);
      }

      slot.textContent = "";
      slot.appendChild(form);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (trap.value) {
          status.textContent = "The request was not sent.";
          return;
        }
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        var payload = {};
        new FormData(form).forEach(function (value, key) { payload[key] = value; });
        if (name === "membership" && payload.password !== payload.confirm) {
          status.textContent = "The passwords do not match.";
          return;
        }
        if (button.disabled) return;
        button.disabled = true;
        status.textContent = "Sending. This is not a confirmation.";
        var endpoint = name === "membership" ? "/api/signup" : cfg.formEndpoint;
        if (name !== "membership") payload.formType = name;
        delete payload.confirm;
        var controller = new AbortController();
        var timer = window.setTimeout(function () { controller.abort(); }, 20000);
        fetch(endpoint, {
          method: "POST",
          credentials: "same-origin",
          body: JSON.stringify(payload),
          headers: { Accept: "application/json", "Content-Type": "application/json", "X-Requested-With": "fetch" },
          signal: controller.signal
        }).then(function (res) {
          window.clearTimeout(timer);
          if (res.status === 429) {
            button.disabled = false;
            status.textContent = "Too many attempts. Wait and try again.";
            return;
          }
          if (!res.ok) {
            return res.json().then(function (data) {
              throw new Error((data && data.error) || "status");
            }).catch(function (error) {
              throw new Error(error.message || "status");
            });
          }
          if (name === "membership") {
            window.location.href = "account.html";
            return;
          }
          form.reset();
          status.textContent = successText(name);
        }).catch(function (error) {
          window.clearTimeout(timer);
          button.disabled = false;
          status.textContent = error && error.message && error.message !== "status"
            ? error.message
            : "The message was not delivered. Your entries are still in the form. You can try again or email " + BRAND.email + ".";
          status.focus();
        });
      });
    });
  }

  function wireDonate() {
    var slot = document.querySelector("[data-donate-slot]");
    if (!slot) return;
    var cfg = siteConfig();
    if (cfg.donationsEnabled !== true || !isHttps(cfg.donationUrl)) return;

    slot.textContent = "";
    var lead = document.createElement("p");
    lead.textContent = "Online giving continues on a hosted checkout page. This website does not collect card numbers. Coming back here does not confirm that a payment was completed.";
    slot.appendChild(lead);

    if (cfg.donationCurrency === "USD" || cfg.donationCurrency === "TTD") {
      var cur = document.createElement("p");
      cur.textContent = "The connected checkout is configured for " + cfg.donationCurrency + ".";
      slot.appendChild(cur);
    }
    var freq = document.createElement("p");
    if (cfg.donationOnetime === true && cfg.donationRecurring === true) {
      freq.textContent = "That checkout offers one-time and monthly gifts.";
      slot.appendChild(freq);
    } else if (cfg.donationOnetime === true) {
      freq.textContent = "That checkout offers one-time gifts.";
      slot.appendChild(freq);
    } else if (cfg.donationRecurring === true) {
      freq.textContent = "That checkout offers monthly gifts.";
      slot.appendChild(freq);
    }

    var link = document.createElement("a");
    link.className = "btn btn--gold btn--lg";
    link.href = cfg.donationUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Continue to secure checkout";
    slot.appendChild(link);
  }

  function init() {
    var headerSlot = document.getElementById("site-header");
    var footerSlot = document.getElementById("site-footer");
    var chatSlot = document.getElementById("site-chatbot");
    if (headerSlot) headerSlot.innerHTML = buildHeader();
    if (footerSlot) footerSlot.innerHTML = buildFooter();
    if (chatSlot) chatSlot.innerHTML = buildChatbot();
    wireLogos();
    wireNav();
    wireReveal();
    wireChat();
    wireForms();
    wireDonate();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

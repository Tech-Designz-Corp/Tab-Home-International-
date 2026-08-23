/* ==========================================================================
   Tabitha's Home International, Inc.
   Shared components (navbar, footer, chatbot) + site interactions
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Brand config (single source of truth) ---- */
  var BRAND = {
    name: "Tabitha's Home",
    sub: "International, Inc.",
    tagline: "Unto the Least of These",
    email: "info@tabithashomeintl.org",
    phone: "+1 (000) 000-0000",
    facebook: "https://www.facebook.com/p/Tabithas-Home-for-Women-and-Children-100067544006813/",
    instagram: "https://www.instagram.com/tabithashome.tt/",
    // Logo fallback chain: first that loads wins; else a styled monogram is shown.
    // The last entry is the originally-uploaded logo location so the brand mark
    // appears immediately; copy the file to assets/Logo.png for deployment.
    logoSources: [
      "assets/Logo.png",
      "asset/Logo.png",
      "Logo.png",
      "file:///C:/Users/ezeki/.cursor/projects/c-Users-ezeki-OneDrive-Documents-Tabitha-s-Home-International-Inc/assets/c__Users_ezeki_OneDrive_Documents_Tabitha_s_Home_International__Inc_asset_Logo.png"
    ]
  };

  var NAV = [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Programs", href: "programs.html" },
    { label: "Member Sign-Up", href: "member-signup.html" },
    { label: "Donate", href: "donate.html" },
    { label: "Newsletter", href: "newsletter.html" },
    { label: "Contact Us", href: "contact.html" }
  ];

  function currentPage() {
    var path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  /* ---- SVG icon set ---- */
  var ICONS = {
    facebook: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    send: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
  };

  function logoMarkup(extraClass) {
    return (
      '<img class="brand__logo ' + (extraClass || "") + '" alt="Tabitha\'s Home International logo" ' +
      'data-logo src="' + BRAND.logoSources[0] + '" />' +
      '<span class="brand__fallback" data-logo-fallback hidden>T</span>'
    );
  }

  /* ---- Header ---- */
  function buildHeader() {
    var page = currentPage();
    var links = NAV.map(function (item) {
      var active = item.href === page ? " is-active" : "";
      return '<li><a class="nav__link' + active + '" href="' + item.href + '">' + item.label + "</a></li>";
    }).join("");

    return (
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
            '<button class="nav__toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">' +
              "<span></span><span></span><span></span>" +
            "</button>" +
          "</nav>" +
        "</div>" +
      "</header>"
    );
  }

  /* ---- Footer ---- */
  function buildFooter() {
    var quick = [
      { label: "Become a Member", href: "member-signup.html" },
      { label: "Donate", href: "donate.html" },
      { label: "Volunteer", href: "member-signup.html" },
      { label: "Request Assistance", href: "contact.html" },
      { label: "Newsletter", href: "newsletter.html" },
      { label: "Contact Us", href: "contact.html" }
    ].map(function (l) { return '<li><a href="' + l.href + '">' + l.label + "</a></li>"; }).join("");

    var explore = [
      { label: "Home", href: "index.html" },
      { label: "About Us", href: "about.html" },
      { label: "Programs", href: "programs.html" },
      { label: "Core Values", href: "index.html#values" },
      { label: "Stories of Hope", href: "index.html#stories" }
    ].map(function (l) { return '<li><a href="' + l.href + '">' + l.label + "</a></li>"; }).join("");

    return (
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<div class="footer__grid">' +
            "<div>" +
              '<div class="footer__brand">' + logoMarkup() +
                '<span class="brand__text"><span class="brand__name">' + BRAND.name +
                '</span><span class="brand__sub" style="color:var(--sky-300)">' + BRAND.sub + "</span></span>" +
              "</div>" +
              '<p class="footer__mission">Restoring hope and rebuilding lives \u2014 empowering women and children through compassion, dignity, refuge, and faith-centered support.</p>' +
              '<div class="socials">' +
                '<a class="social-btn" href="' + BRAND.facebook + '" target="_blank" rel="noopener" aria-label="Facebook">' + ICONS.facebook + "</a>" +
                '<a class="social-btn" href="' + BRAND.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + ICONS.instagram + "</a>" +
              "</div>" +
            "</div>" +
            "<div>" +
              "<h4>Quick Links</h4>" +
              '<ul class="footer__links">' + quick + "</ul>" +
            "</div>" +
            "<div>" +
              "<h4>Explore</h4>" +
              '<ul class="footer__links">' + explore + "</ul>" +
            "</div>" +
            '<div class="footer__news">' +
              "<h4>Stay Connected</h4>" +
              '<p class="footer__mission">Receive updates, testimonies, events, and prayer needs.</p>' +
              '<form data-form="footer-news" novalidate>' +
                '<input class="input" type="email" name="email" placeholder="Your email address" required aria-label="Email address" />' +
                '<button class="btn btn--accent" type="submit" aria-label="Subscribe">' + ICONS.send + "</button>" +
              "</form>" +
              '<div class="form-success" data-success style="margin-top:.7rem">' + ICONS.check + "<span>Thank you for subscribing!</span></div>" +
            "</div>" +
          "</div>" +
          '<div class="footer__bottom">' +
            "<span>&copy; 2026 Tabitha's Home International, Inc. All Rights Reserved.</span>" +
            '<span class="footer__tag">\u201C' + BRAND.tagline + "\u201D</span>" +
          "</div>" +
        "</div>" +
      "</footer>"
    );
  }

  /* ---- Chatbot ---- */
  var CHAT_QUICK = [
    "Become a Member", "Donate Now", "Request Assistance", "Volunteer",
    "Contact Us", "Newsletter Sign-Up", "Prayer Request"
  ];

  var CHAT_REPLIES = {
    "become a member": "Wonderful! You can join our mission on the Member Sign-Up page \u2014 choose from General, Volunteer, Donor, Ministry, Community, or Prayer Partner. Head to member-signup.html to begin.",
    "donate now": "Thank you for your generosity! Visit our Donate page to give a one-time or monthly gift, sponsor a child or family, and see the impact of your support.",
    "request assistance": "We're here for you. Please visit our Contact page and select \u201CRequest Assistance,\u201D or share a few details here and our care team will reach out with compassion.",
    "volunteer": "We'd love your help! Volunteers bless our women and children every day. Sign up as a Volunteer Member on the Member Sign-Up page.",
    "contact us": "You can reach us anytime at " + BRAND.email + " or through the Contact page. We are here to serve with compassion, faith, and love.",
    "newsletter sign-up": "Stay connected with the mission! Visit the Newsletter page to receive updates, testimonies, events, and prayer needs.",
    "prayer request": "It would be our honor to pray with you. Share your request through the Contact page (select \u201CPrayer Request\u201D) and our prayer partners will lift you up.",
    "learn about our mission": "Tabitha's Home International, Inc. exists to restore, empower, and transform the lives of women and children through faith, compassion, and dignity. Learn more on our About page.",
    "default": "Thank you for reaching out. I can help you become a member, donate, request assistance, volunteer, contact us, sign up for the newsletter, or submit a prayer request. How may I serve you today?"
  };

  function buildChatbot() {
    var quick = CHAT_QUICK.map(function (q) {
      return '<button type="button" data-quick="' + q.toLowerCase() + '">' + q + "</button>";
    }).join("");

    return (
      '<button class="chat-fab" id="chatFab" aria-label="Open Tabitha Assistant">' +
        '<span class="chat-fab__icon">' + ICONS.chat + "</span>" +
        '<span class="chat-fab__label">Tabitha Assistant</span>' +
      "</button>" +
      '<section class="chat-panel" id="chatPanel" role="dialog" aria-label="Tabitha Assistant" aria-modal="false">' +
        '<div class="chat-head">' +
          '<div class="chat-head__avatar">T</div>' +
          "<div>" +
            '<div class="chat-head__name">Tabitha Assistant</div>' +
            '<div class="chat-head__status"><span class="dot"></span> Online \u2022 here to help</div>' +
          "</div>" +
          '<button class="chat-close" id="chatClose" aria-label="Close chat">\u00D7</button>' +
        "</div>" +
        '<div class="chat-body" id="chatBody"></div>' +
        '<div class="chat-quick" id="chatQuick">' + quick + "</div>" +
        '<form class="chat-input" id="chatForm">' +
          '<input type="text" id="chatInput" placeholder="Type your message\u2026" aria-label="Message" autocomplete="off" />' +
          '<button class="chat-send" type="submit" aria-label="Send">' + ICONS.send + "</button>" +
        "</form>" +
      "</section>"
    );
  }

  /* ---- Logo fallback wiring ---- */
  function wireLogos() {
    document.querySelectorAll("[data-logo]").forEach(function (img) {
      var idx = 0;
      function advance() {
        idx++;
        if (idx < BRAND.logoSources.length) {
          img.src = BRAND.logoSources[idx];
        } else {
          img.style.display = "none";
          var fb = img.parentElement.querySelector("[data-logo-fallback]");
          if (fb) fb.hidden = false;
        }
      }
      img.addEventListener("error", advance);
      // Catch images that already failed before this handler was attached
      // (hard-coded <img> tags begin loading before DOMContentLoaded fires).
      if (img.complete && img.naturalWidth === 0) advance();
    });
  }

  /* ---- Navigation behavior ---- */
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

  /* ---- Scroll reveal ---- */
  function wireReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Chatbot behavior ---- */
  function wireChat() {
    var fab = document.getElementById("chatFab");
    var panel = document.getElementById("chatPanel");
    var close = document.getElementById("chatClose");
    var body = document.getElementById("chatBody");
    var form = document.getElementById("chatForm");
    var input = document.getElementById("chatInput");
    var quick = document.getElementById("chatQuick");
    if (!fab || !panel) return;

    var greeted = false;
    function addMsg(text, who) {
      var div = document.createElement("div");
      div.className = "chat-msg chat-msg--" + who;
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }
    function botReply(text) {
      setTimeout(function () { addMsg(text, "bot"); }, 450);
    }
    function open() {
      panel.classList.add("is-open");
      fab.classList.add("is-hidden");
      if (!greeted) {
        greeted = true;
        addMsg("Hello, welcome to Tabitha's Home International, Inc. How may we assist you today?", "bot");
      }
      setTimeout(function () { input && input.focus(); }, 300);
    }
    function hide() {
      panel.classList.remove("is-open");
      fab.classList.remove("is-hidden");
    }
    function answer(text) {
      var key = text.trim().toLowerCase();
      var reply = CHAT_REPLIES[key];
      if (!reply) {
        Object.keys(CHAT_REPLIES).some(function (k) {
          if (k !== "default" && key.indexOf(k) !== -1) { reply = CHAT_REPLIES[k]; return true; }
          return false;
        });
      }
      botReply(reply || CHAT_REPLIES.default);
    }

    fab.addEventListener("click", open);
    close.addEventListener("click", hide);
    quick.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-quick]");
      if (!btn) return;
      addMsg(btn.textContent, "user");
      answer(btn.getAttribute("data-quick"));
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = input.value.trim();
      if (!val) return;
      addMsg(val, "user");
      input.value = "";
      answer(val);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) hide();
    });
  }

  /* ---- Generic form handling (demo: no backend) ---- */
  function wireForms() {
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        var success = form.parentElement.querySelector("[data-success]") ||
                      (form.nextElementSibling && form.nextElementSibling.matches && form.nextElementSibling.matches("[data-success]") ? form.nextElementSibling : null) ||
                      document.querySelector('[data-success="' + form.getAttribute("data-form") + '"]');
        form.reset();
        // reset visual selectors
        form.querySelectorAll(".is-selected").forEach(function (el) { el.classList.remove("is-selected"); });
        if (success) {
          success.classList.add("is-visible");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(function () { success.classList.remove("is-visible"); }, 6000);
        }
      });
    });
  }

  /* ---- Donation page interactions ---- */
  function wireDonation() {
    var amountGrid = document.querySelector("[data-amount-grid]");
    if (amountGrid) {
      var custom = document.querySelector("[data-custom-amount]");
      amountGrid.addEventListener("click", function (e) {
        var opt = e.target.closest(".amount-opt");
        if (!opt) return;
        amountGrid.querySelectorAll(".amount-opt").forEach(function (o) { o.classList.remove("is-selected"); });
        opt.classList.add("is-selected");
        var val = opt.getAttribute("data-amount");
        if (custom && val && val !== "custom") custom.value = val;
        if (custom && val === "custom") { custom.focus(); custom.value = ""; }
      });
    }
    document.querySelectorAll(".donate-type").forEach(function (group) {
      group.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        group.querySelectorAll("button").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var hidden = group.parentElement.querySelector("[data-donate-type-value]");
        if (hidden) hidden.value = btn.textContent.trim();
      });
    });
    var payGrid = document.querySelector("[data-pay-grid]");
    if (payGrid) {
      payGrid.addEventListener("click", function (e) {
        var opt = e.target.closest(".pay-opt");
        if (!opt) return;
        payGrid.querySelectorAll(".pay-opt").forEach(function (o) { o.classList.remove("is-selected"); });
        opt.classList.add("is-selected");
      });
    }
  }

  /* ---- Footer year (in case of edits) ---- */
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
    wireDonation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

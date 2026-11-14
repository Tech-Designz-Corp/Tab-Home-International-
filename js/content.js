/* ==========================================================================
   Home page content: Core Values, Programs, Stories of Hope
   Rendered into placeholder grids. Keeps content easy to update.
   ========================================================================== */
(function () {
  "use strict";

  var I = {
    compassion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5.5 5.5 0 00-7.8 0L12 6.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>',
    dignity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 20.5 7.1 17.2l.9-5.5-4-3.9L9.5 7z"/></svg>',
    independence: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6"/><path d="M12 8a6 6 0 016 6c0 4-3 8-6 8s-6-4-6-8a6 6 0 016-6z"/><path d="M9 5l3-3 3 3"/></svg>',
    faith: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M6 8h12"/></svg>',
    restoration: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 109-9"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/></svg>',
    hope: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
    service: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21l-1-1c-4-3.5-7-6-7-9.5A4.5 4.5 0 0112 7a4.5 4.5 0 018 4.5c0 3.5-3 6-7 9.5z"/><path d="M2 13h4l1.5-2 2 4 1.5-3 1 1H22"/></svg>',
    women: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/></svg>',
    children: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0112 0"/><path d="M14.5 20a4 4 0 016.5-3"/></svg>',
    emergency: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 16H3z"/><path d="M12 9v4M12 16h.01"/></svg>',
    outreach: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>',
    encourage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M12 7v6M9 10h6"/></svg>',
    volunteer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><path d="M2 21a7 7 0 0114 0"/><path d="M17 11l2 2 4-4"/></svg>',
    donation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 8l9-5 9 5M8 21v-5h8v5"/></svg>'
  };

  var VALUES = [
    { icon: "compassion", title: "Compassion", text: "We meet every woman and child with the tender, unconditional love of Christ." },
    { icon: "dignity", title: "Dignity", text: "Every person is made in God's image and worthy of honor, respect, and worth." },
    { icon: "independence", title: "Independence", text: "We equip and empower individuals to stand on their own and thrive." },
    { icon: "faith", title: "Faith", text: "Our work is rooted in God's love, grace, and the hope found in Him." },
    { icon: "restoration", title: "Restoration", text: "We believe in healing, renewal, and the rebuilding of broken lives." },
    { icon: "hope", title: "Hope", text: "We are a beacon of light, offering a hopeful future to those in darkness." },
    { icon: "service", title: "Service", text: "We watch out for what is better for others, serving unto the least of these." }
  ];

  var PROGRAMS = [
    { icon: "women", title: "Women's Support Services", text: "Safe shelter, counseling, mentorship, and life-skills to help women heal and rebuild." },
    { icon: "children", title: "Children's Support Programs", text: "Nurturing care, education support, and faith-filled encouragement for children." },
    { icon: "emergency", title: "Emergency Assistance", text: "Immediate help for those in crisis \u2014 shelter, food, and essential needs." },
    { icon: "outreach", title: "Community Outreach", text: "Bringing hope into our community through partnerships, events, and care." },
    { icon: "encourage", title: "Faith-Based Encouragement", text: "Prayer, scripture, and spiritual support that restores the heart and soul." },
    { icon: "volunteer", title: "Volunteer Support", text: "Compassionate volunteers serving alongside us to bless those in need." },
    { icon: "donation", title: "Donation Drives", text: "Gathering resources and gifts to provide for women and children in need." }
  ];

  var STORIES = [
    { initials: "A", name: "A Mother's New Beginning", role: "Restored & Independent", text: "When I had nowhere to turn, Tabitha's Home gave me refuge and dignity. Through their faith and care, I found healing and a future for my children." },
    { initials: "H", name: "Hope for the Children", role: "Children's Program", text: "My kids are smiling again. The team surrounded us with prayer, support, and love. We finally feel safe and seen." },
    { initials: "G", name: "A Journey of Grace", role: "Women's Support Services", text: "I learned that I am valued and loved by God. Today I stand on my own, with purpose and hope I never thought possible." }
  ];

  function card(v) {
    return (
      '<article class="card value-card reveal" data-delay="' + (Math.floor(Math.random()*3)+1) + '">' +
        '<div class="card__icon">' + I[v.icon] + "</div>" +
        '<h3 class="card__title">' + v.title + "</h3>" +
        '<p class="card__text">' + v.text + "</p>" +
      "</article>"
    );
  }

  function program(p) {
    return (
      '<article class="card program-card reveal">' +
        '<div class="card__icon">' + I[p.icon] + "</div>" +
        '<h3 class="card__title">' + p.title + "</h3>" +
        '<p class="card__text">' + p.text + "</p>" +
        '<a class="card__link" href="programs.html">Learn More \u2192</a>' +
      "</article>"
    );
  }

  function story(s) {
    return (
      '<article class="testimonial reveal">' +
        '<p class="testimonial__text">' + s.text + "</p>" +
        '<div class="testimonial__author">' +
          '<span class="testimonial__avatar">' + s.initials + "</span>" +
          "<span><span class=\"testimonial__name\">" + s.name + "</span><br><span class=\"testimonial__role\">" + s.role + "</span></span>" +
        "</div>" +
      "</article>"
    );
  }

  function fill(id, items, fn) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = items.map(fn).join("");
  }

  function run() {
    fill("valuesGrid", VALUES, card);
    fill("programsGrid", PROGRAMS, program);
    fill("storiesGrid", STORIES, story);
    // re-run reveal observer for newly added nodes
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();

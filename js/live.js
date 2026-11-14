/* Launch join link. Zoom is opened in a new tab. The page does not build a frame.
   A countdown reaching zero must not change the status to live. */
(function () {
  "use strict";

  var KNOWN = { scheduled: 1, live: 1, interrupted: 1, ended: 1, replay: 1, unavailable: 1 };

  function isHttps(value) {
    try {
      var u = new URL(value);
      return u.protocol === "https:" && !u.username && !u.password;
    } catch (e) {
      return false;
    }
  }

  function isZoomLink(value) {
    if (!isHttps(value)) return false;
    var host = new URL(value).hostname.toLowerCase();
    return host === "zoom.us" || host.slice(-8) === ".zoom.us";
  }

  function publicStatus(cfg) {
    if (!cfg || cfg.enabled !== true || cfg.provider !== "zoom") return "unavailable";
    if (!KNOWN[cfg.status]) return "unavailable";
    if ((cfg.status === "scheduled" || cfg.status === "live" || cfg.status === "interrupted") && !isZoomLink(cfg.watchUrl)) {
      return "unavailable";
    }
    return cfg.status;
  }

  function add(parent, tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    parent.appendChild(el);
    return el;
  }

  function formatStart(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "The start time in the configuration is not a valid date.";
    var eastern = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short"
    }).format(d);
    var tobago = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Port_of_Spain",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short"
    }).format(d);
    return eastern + " (" + tobago + " in Tobago).";
  }

  function statusCopy(status) {
    if (status === "scheduled") return "Scheduled. The join button opens Zoom. This page does not mark the meeting live until an operator says it is open.";
    if (status === "live") return "An operator has marked the meeting open. Opening Zoom does not prove that the meeting has started.";
    if (status === "interrupted") return "An operator has marked the meeting interrupted. The Zoom link is still available.";
    if (status === "ended") return "An operator has marked the meeting ended.";
    if (status === "replay") return "A replay is not shown on this page.";
    return "Unavailable";
  }

  function render(root) {
    var cfg = window.LIVE_CONFIG || {};
    var compact = root.hasAttribute("data-live-compact");
    var status = publicStatus(cfg);
    var href = isZoomLink(cfg.watchUrl) ? cfg.watchUrl : "";
    var showJoin = href && (status === "scheduled" || status === "live" || status === "interrupted");
    root.textContent = "";

    var pill = add(root, "p", "live-status live-status--" + status, statusCopy(status));
    pill.setAttribute("role", "status");

    add(root, "p", "live-when", "Scheduled start: " + formatStart(cfg.start));
    add(root, "p", "live-fixed", "The published clock time is 6:00 p.m. Eastern on November 14, 2026, which is 7:00 p.m. in Tobago.");

    var clock = add(root, "div", "nye-clock" + (compact ? " nye-clock--compact" : ""), "");
    clock.setAttribute("aria-hidden", "true");
    ["Days", "Hours", "Minutes", "Seconds"].forEach(function (label) {
      var unit = add(clock, "div", "nye-unit", "");
      var digits = add(unit, "span", "nye-digits", "00");
      digits.setAttribute("data-unit", label.toLowerCase());
      add(unit, "span", "nye-label", label);
    });
    var count = add(root, "p", "live-countdown", "");
    var startMs = new Date(cfg.start).getTime();
    function pad(n) { return n < 10 ? "0" + n : String(n); }
    function tick() {
      if (isNaN(startMs)) {
        clock.hidden = true;
        count.textContent = "A countdown is not shown because the start time is invalid. Reaching zero will not mark the event live.";
        return;
      }
      var diff = startMs - Date.now();
      var total = diff > 0 ? Math.floor(diff / 1000) : 0;
      var days = Math.floor(total / 86400);
      var hours = Math.floor((total % 86400) / 3600);
      var minutes = Math.floor((total % 3600) / 60);
      var seconds = total % 60;
      clock.querySelectorAll(".nye-digits").forEach(function (el) {
        var unit = el.getAttribute("data-unit");
        var value = unit === "days" ? days : unit === "hours" ? hours : unit === "minutes" ? minutes : seconds;
        el.textContent = pad(value);
      });
      if (diff <= 0) {
        count.textContent = "The scheduled start time has passed. Reaching zero will not mark the event live.";
        return;
      }
      count.textContent = "Time until the scheduled start: " + days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds. Reaching zero will not mark the event live.";
    }
    tick();
    window.setInterval(tick, 1000);

    var note = (cfg.message && String(cfg.message)) || "The meeting is not available on this page.";
    add(root, "p", "live-note", note);

    if (!compact && showJoin) {
      var link = add(root, "a", "btn btn--primary", "Join the meeting on Zoom");
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener";
      add(root, "p", "live-help", "Zoom opens in a new tab. This page does not place the meeting inside the site, and it does not use your camera or microphone.");
    } else if (!compact) {
      add(root, "p", "live-help", "No join button is shown. A missing or non-Zoom address never falls back to a sample meeting.");
    }

    add(root, "p", "live-cache", "Status changes when this file is edited and the site is deployed again. Caching can delay what visitors see.");

    if (compact) {
      var more = add(root, "a", "btn btn--primary", "Join the Launch");
      more.href = "live.html";
    }
  }

  function init() {
    document.querySelectorAll("[data-live-root]").forEach(render);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

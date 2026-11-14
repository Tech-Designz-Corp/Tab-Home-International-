"use strict";

const { query } = require("./db");

const LIMITS = {
  signup: { max: 5, window: 3600 },
  login: { max: 10, window: 900 },
  password: { max: 5, window: 3600 },
  delete: { max: 5, window: 3600 },
  settings: { max: 20, window: 3600 },
  form: { max: 5, window: 3600 }
};

const MEMBERSHIP_TYPES = [
  "General Member",
  "Volunteer Member",
  "Donor Member",
  "Ministry Partner",
  "Community Partner",
  "Prayer Partner"
];

const CONTACT_REASONS = [
  "Request Assistance",
  "Volunteer",
  "Donate",
  "Partnership",
  "Prayer Request",
  "General Question"
];

const CONTACT_PREFERENCES = ["Email", "Phone"];

const FORM_TYPES = ["contact", "home-contact", "newsletter", "home-news", "footer-news"];

function text(value, max) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (trimmed.length > max) return null;
  return trimmed;
}

function email(value) {
  const trimmed = text(value, 200);
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  return trimmed.toLowerCase();
}

function password(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length < 10 || trimmed.length > 72) return null;
  return trimmed;
}

async function limited(action, subjectHash) {
  const rule = LIMITS[action];
  if (!rule) return true;
  const windowStart = Math.floor(Date.now() / 1000 / rule.window) * rule.window;
  await query(
    "INSERT INTO rate_limits (action, subject_hash, window_start, attempts) VALUES (?, ?, ?, 1) ON DUPLICATE KEY UPDATE attempts = attempts + 1",
    [action, subjectHash, windowStart]
  );
  const rows = await query(
    "SELECT attempts FROM rate_limits WHERE action = ? AND subject_hash = ? AND window_start = ?",
    [action, subjectHash, windowStart]
  );
  return !rows.length || rows[0].attempts > rule.max;
}

module.exports = {
  MEMBERSHIP_TYPES: MEMBERSHIP_TYPES,
  CONTACT_REASONS: CONTACT_REASONS,
  CONTACT_PREFERENCES: CONTACT_PREFERENCES,
  FORM_TYPES: FORM_TYPES,
  text: text,
  email: email,
  password: password,
  limited: limited
};

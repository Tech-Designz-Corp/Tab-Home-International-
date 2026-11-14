"use strict";

const { configured, query } = require("../lib/db");
const { send, readBody, allowsFetch, clientHash } = require("../lib/http");
const { text, email, limited, FORM_TYPES, CONTACT_REASONS, CONTACT_PREFERENCES } = require("../lib/guard");

function newsletterPayload(body) {
  const name = text(body.name, 120);
  const address = email(body.email);
  if (name === null || !address) return null;
  if (body.marketingConsent !== "yes") return null;
  return { name: name, email: address, marketingConsent: "yes" };
}

function contactPayload(body) {
  const name = text(body.name, 120);
  const address = email(body.email);
  const phone = text(body.phone, 40);
  const preference = text(body.contactPreference, 20);
  const reason = text(body.reason, 40);
  const note = text(body.note, 1000);
  if (!name || !address || phone === null || note === null) return null;
  if (CONTACT_PREFERENCES.indexOf(preference) === -1) return null;
  if (CONTACT_REASONS.indexOf(reason) === -1) return null;
  return {
    name: name,
    email: address,
    phone: phone,
    contactPreference: preference,
    reason: reason,
    note: note
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!allowsFetch(req)) return send(res, 400, { error: "The request was not sent." });
  if (!configured()) return send(res, 503, { error: "The message was not delivered." });
  try {
    const body = await readBody(req);
    if (text(body.company, 200)) return send(res, 400, { error: "The request was not sent." });
    if (await limited("form", clientHash(req))) return send(res, 429, { error: "Too many attempts. Wait and try again." });
    const formType = text(body.formType, 32);
    if (FORM_TYPES.indexOf(formType) === -1) return send(res, 400, { error: "The message was not delivered." });
    const payload = formType.indexOf("news") !== -1 ? newsletterPayload(body) : contactPayload(body);
    if (!payload) return send(res, 400, { error: "The message was not delivered." });
    await query("INSERT INTO submissions (form_type, payload) VALUES (?, ?)", [formType, JSON.stringify(payload)]);
    return send(res, 200, { ok: true });
  } catch (error) {
    if (error && error.status === 413) return send(res, 413, { error: "The message was not delivered." });
    console.error(error && error.code ? error.code : "form insert failed");
    return send(res, 500, { error: "The message was not delivered." });
  }
};

"use strict";

const { configured, query } = require("../lib/db");
const { send, readBody, allowsFetch, clientHash } = require("../lib/http");
const { text, limited } = require("../lib/guard");
const { memberFromRequest, publicMember } = require("../lib/accounts");

module.exports = async function handler(req, res) {
  if (!configured()) return send(res, 503, { error: "The account is not available." });
  try {
    const member = await memberFromRequest(req);
    if (!member) return send(res, 401, { error: "Sign in to view this account." });
    if (req.method === "GET") return send(res, 200, publicMember(member));
    if (req.method !== "PATCH") return send(res, 405, { error: "Method not allowed" });
    if (!allowsFetch(req)) return send(res, 400, { error: "The request was not sent." });
    const body = await readBody(req);
    if (await limited("settings", clientHash(req))) return send(res, 429, { error: "Too many attempts. Wait and try again." });
    const name = text(body.name, 120);
    const phone = text(body.phone, 40);
    if (!name || phone === null) return send(res, 400, { error: "Enter a name. The phone can be left blank." });
    const consent = body.marketingConsent === true || body.marketingConsent === "yes" ? 1 : 0;
    await query("UPDATE members SET name = ?, phone = ?, marketing_consent = ? WHERE id = ?", [name, phone, consent, member.id]);
    const rows = await query(
      "SELECT email, name, phone, membership_type, marketing_consent, created_at, last_login_at FROM members WHERE id = ?",
      [member.id]
    );
    return send(res, 200, publicMember(rows[0]));
  } catch (error) {
    if (error && error.status === 413) return send(res, 413, { error: "The account was not updated." });
    console.error(error && error.code ? error.code : "account update failed");
    return send(res, 500, { error: "The account was not updated." });
  }
};

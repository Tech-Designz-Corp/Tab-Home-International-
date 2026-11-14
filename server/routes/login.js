"use strict";

const { configured, query } = require("../lib/db");
const { send, readBody, allowsFetch, clientHash, sessionCookie } = require("../lib/http");
const { email, password, limited } = require("../lib/guard");
const { checkPassword, startSession, DUMMY_HASH } = require("../lib/accounts");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!allowsFetch(req)) return send(res, 400, { error: "The request was not sent." });
  if (!configured()) return send(res, 503, { error: "Sign-in is not available." });
  try {
    const body = await readBody(req);
    if (await limited("login", clientHash(req))) return send(res, 429, { error: "Too many attempts. Wait and try again." });
    const address = email(body.email);
    const secret = password(body.password);
    if (!address || !secret) return send(res, 401, { error: "The email or password was not accepted." });
    const rows = await query("SELECT id, password_hash FROM members WHERE email = ? LIMIT 1", [address]);
    const row = rows[0];
    const accepted = await checkPassword(row ? row.password_hash : DUMMY_HASH, secret);
    if (!row || !accepted) return send(res, 401, { error: "The email or password was not accepted." });
    await query("UPDATE members SET last_login_at = UTC_TIMESTAMP() WHERE id = ?", [row.id]);
    const token = await startSession(row.id);
    return send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie(token, req) });
  } catch (error) {
    if (error && error.status === 413) return send(res, 413, { error: "Sign-in is not available." });
    console.error(error && error.code ? error.code : "login failed");
    return send(res, 500, { error: "Sign-in is not available." });
  }
};

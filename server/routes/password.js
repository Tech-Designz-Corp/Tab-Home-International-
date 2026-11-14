"use strict";

const bcrypt = require("bcryptjs");
const { configured, query } = require("../lib/db");
const { send, readBody, allowsFetch, clientHash } = require("../lib/http");
const { password, limited } = require("../lib/guard");
const { memberFromRequest, checkPassword } = require("../lib/accounts");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!allowsFetch(req)) return send(res, 400, { error: "The request was not sent." });
  if (!configured()) return send(res, 503, { error: "The password was not changed." });
  try {
    const member = await memberFromRequest(req);
    if (!member) return send(res, 401, { error: "Sign in to change this password." });
    const body = await readBody(req);
    if (await limited("password", clientHash(req))) return send(res, 429, { error: "Too many attempts. Wait and try again." });
    const current = password(body.currentPassword);
    const next = password(body.password);
    if (!current || !next) return send(res, 400, { error: "Use the current password and a new password of 10 to 72 characters." });
    const accepted = await checkPassword(member.password_hash, current);
    if (!accepted) return send(res, 401, { error: "The current password was not accepted." });
    const passwordHash = await bcrypt.hash(next, 12);
    await query("UPDATE members SET password_hash = ? WHERE id = ?", [passwordHash, member.id]);
    return send(res, 200, { ok: true });
  } catch (error) {
    if (error && error.status === 413) return send(res, 413, { error: "The password was not changed." });
    console.error(error && error.code ? error.code : "password change failed");
    return send(res, 500, { error: "The password was not changed." });
  }
};

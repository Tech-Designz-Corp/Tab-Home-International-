"use strict";

const { configured } = require("../lib/db");
const { send, readBody, allowsFetch, clientHash, clearCookie } = require("../lib/http");
const { password, limited } = require("../lib/guard");
const { memberFromRequest, checkPassword, withConnection } = require("../lib/accounts");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!allowsFetch(req)) return send(res, 400, { error: "The request was not sent." });
  if (!configured()) return send(res, 503, { error: "The account was not deleted." });
  try {
    const member = await memberFromRequest(req);
    if (!member) return send(res, 401, { error: "Sign in to delete this account." });
    const body = await readBody(req);
    if (await limited("delete", clientHash(req))) return send(res, 429, { error: "Too many attempts. Wait and try again." });
    const current = password(body.currentPassword);
    if (!current) return send(res, 400, { error: "Enter the current password to delete the account." });
    const accepted = await checkPassword(member.password_hash, current);
    if (!accepted) return send(res, 401, { error: "The current password was not accepted." });
    await withConnection(async function (connection) {
      await connection.execute("DELETE FROM sessions WHERE member_id = ?", [member.id]);
      await connection.execute("DELETE FROM members WHERE id = ?", [member.id]);
    });
    return send(res, 200, { ok: true }, { "Set-Cookie": clearCookie(req) });
  } catch (error) {
    if (error && error.status === 413) return send(res, 413, { error: "The account was not deleted." });
    console.error(error && error.code ? error.code : "account delete failed");
    return send(res, 500, { error: "The account was not deleted." });
  }
};

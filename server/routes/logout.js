"use strict";

const { configured, query } = require("../lib/db");
const { send, allowsFetch, cookies, tokenHash, clearCookie, COOKIE } = require("../lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!allowsFetch(req)) return send(res, 400, { error: "The request was not sent." });
  try {
    const token = cookies(req)[COOKIE];
    if (configured() && token) await query("DELETE FROM sessions WHERE token_hash = ?", [tokenHash(token)]);
    return send(res, 200, { ok: true }, { "Set-Cookie": clearCookie(req) });
  } catch (error) {
    console.error(error && error.code ? error.code : "logout failed");
    return send(res, 200, { ok: true }, { "Set-Cookie": clearCookie(req) });
  }
};

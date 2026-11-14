"use strict";

const crypto = require("crypto");
const { configured, query } = require("../lib/db");
const { send } = require("../lib/http");
const { FORM_TYPES } = require("../lib/guard");

function parsedPayload(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return { unreadable: true };
  }
}

function authorized(req) {
  const expected = process.env.QUERY_TOKEN || "";
  const header = String(req.headers.authorization || "");
  const supplied = header.indexOf("Bearer ") === 0 ? header.slice(7) : "";
  if (!expected || !supplied) return false;
  const left = Buffer.from(supplied);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Method not allowed" });
  if (!authorized(req)) return send(res, 401, { error: "Not authorized." });
  if (!configured()) return send(res, 503, { error: "The database is not connected." });
  try {
    const url = new URL(req.url, "https://tabithashomeintl.org");
    const form = url.searchParams.get("form") || "";
    if (form && FORM_TYPES.indexOf(form) === -1) return send(res, 400, { error: "Unknown form." });
    const rows = form
      ? await query("SELECT id, form_type, created_at, payload FROM submissions WHERE form_type = ? ORDER BY id DESC LIMIT 200", [form])
      : await query("SELECT id, form_type, created_at, payload FROM submissions ORDER BY id DESC LIMIT 200", []);
    return send(res, 200, rows.map(function (row) {
      return {
        id: row.id,
        formType: row.form_type,
        createdAt: row.created_at,
        payload: typeof row.payload === "string" ? parsedPayload(row.payload) : row.payload
      };
    }));
  } catch (error) {
    console.error(error && error.code ? error.code : "submission query failed");
    return send(res, 500, { error: "The request was not completed." });
  }
};

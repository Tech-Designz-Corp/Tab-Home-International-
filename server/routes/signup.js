"use strict";

const bcrypt = require("bcryptjs");
const { configured, query } = require("../lib/db");
const { send, readBody, allowsFetch, clientHash, sessionCookie } = require("../lib/http");
const { text, email, password, limited, MEMBERSHIP_TYPES } = require("../lib/guard");
const { startSession } = require("../lib/accounts");
const { notify } = require("../lib/mail");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!allowsFetch(req)) return send(res, 400, { error: "The request was not sent." });
  if (!configured()) return send(res, 503, { error: "The account was not created." });
  try {
    const body = await readBody(req);
    if (text(body.company, 200)) return send(res, 400, { error: "The request was not sent." });
    if (await limited("signup", clientHash(req))) return send(res, 429, { error: "Too many attempts. Wait and try again." });
    const name = text(body.name, 120);
    const address = email(body.email);
    const phone = text(body.phone, 40);
    const membershipType = text(body.membershipType, 64);
    const secret = password(body.password);
    if (!name || !address || phone === null || !secret || MEMBERSHIP_TYPES.indexOf(membershipType) === -1) {
      return send(res, 400, { error: "Check the name, email, membership type, and a password of 10 to 72 characters." });
    }
    const passwordHash = await bcrypt.hash(secret, 12);
    const consent = body.marketingConsent === "yes" ? 1 : 0;
    const result = await query(
      "INSERT INTO members (email, password_hash, name, phone, membership_type, marketing_consent) VALUES (?, ?, ?, ?, ?, ?)",
      [address, passwordHash, name, phone, membershipType, consent]
    );
    const token = await startSession(result.insertId);
    await notify({
      kind: "member",
      visitorEmail: address,
      fields: [
        { label: "Name", value: name },
        { label: "Email", value: address },
        { label: "Phone", value: phone },
        { label: "Membership", value: membershipType },
        { label: "Email updates", value: consent ? "yes" : "no" }
      ].filter(function (row) { return row.value; })
    }).catch(function () {});
    return send(res, 201, { ok: true }, { "Set-Cookie": sessionCookie(token, req) });
  } catch (error) {
    if (error && error.status === 413) return send(res, 413, { error: "The account was not created." });
    if (error && (error.code === "ER_DUP_ENTRY" || error.errno === 1062)) {
      return send(res, 409, { error: "An account with that email already exists. Use the account page to sign in." });
    }
    console.error(error && error.code ? error.code : "signup failed");
    return send(res, 500, { error: "The account was not created." });
  }
};

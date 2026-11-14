"use strict";

const bcrypt = require("bcryptjs");
const { query, connect } = require("./db");
const { cookies, tokenHash, newToken, COOKIE } = require("./http");

const DUMMY_HASH = bcrypt.hashSync("rate-limit-padding", 12);

function publicMember(row) {
  return {
    email: row.email,
    name: row.name,
    phone: row.phone,
    membershipType: row.membership_type,
    marketingConsent: row.marketing_consent === 1 || row.marketing_consent === true,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at
  };
}

async function memberFromRequest(req) {
  const token = cookies(req)[COOKIE];
  if (!token) return null;
  const rows = await query(
    "SELECT m.id, m.email, m.name, m.phone, m.membership_type, m.marketing_consent, m.created_at, m.last_login_at, m.password_hash FROM members m INNER JOIN sessions s ON s.member_id = m.id WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP()",
    [tokenHash(token)]
  );
  return rows[0] || null;
}

async function startSession(memberId) {
  const token = newToken();
  await query(
    "INSERT INTO sessions (member_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 14 DAY))",
    [memberId, tokenHash(token)]
  );
  return token;
}

async function withConnection(work) {
  const connection = await connect();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

async function checkPassword(hash, supplied) {
  return bcrypt.compare(supplied, hash || DUMMY_HASH);
}

module.exports = {
  publicMember: publicMember,
  memberFromRequest: memberFromRequest,
  startSession: startSession,
  withConnection: withConnection,
  checkPassword: checkPassword,
  DUMMY_HASH: DUMMY_HASH
};

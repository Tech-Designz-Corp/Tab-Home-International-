"use strict";

const crypto = require("crypto");

const COOKIE = "thi_session";
const MAX_AGE = 14 * 24 * 60 * 60;

function send(res, status, body, extraHeaders) {
  const headers = Object.assign({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, extraHeaders || {});
  if (typeof res.status === "function") {
    Object.keys(headers).forEach(function (key) { res.setHeader(key, headers[key]); });
    res.status(status).json(body);
    return;
  }
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

function cookies(req) {
  const header = req.headers.cookie || "";
  const out = Object.create(null);
  header.split(";").forEach(function (part) {
    const index = part.indexOf("=");
    if (index === -1) return;
    const key = part.slice(0, index).trim();
    out[key] = decodeURIComponent(part.slice(index + 1).trim());
  });
  return out;
}

function secureRequest(req) {
  const proto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  return proto === "https";
}

function sessionCookie(token, req) {
  const parts = [COOKIE + "=" + encodeURIComponent(token), "HttpOnly", "SameSite=Lax", "Path=/", "Max-Age=" + MAX_AGE];
  if (secureRequest(req)) parts.push("Secure");
  return parts.join("; ");
}

function clearCookie(req) {
  const parts = [COOKIE + "=", "HttpOnly", "SameSite=Lax", "Path=/", "Max-Age=0"];
  if (secureRequest(req)) parts.push("Secure");
  return parts.join("; ");
}

function clientHash(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (typeof forwarded === "string" ? forwarded.split(",")[0] : "") || (req.socket && req.socket.remoteAddress) || "unknown";
  return crypto.createHash("sha256").update(String(ip).trim()).digest("hex");
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
      resolve(req.body);
      return;
    }
    if (typeof req.body === "string") {
      try { resolve(JSON.parse(req.body) || {}); } catch (error) { resolve({}); }
      return;
    }
    const chunks = [];
    let size = 0;
    req.on("data", function (chunk) {
      size += chunk.length;
      if (size > 20000) {
        reject(Object.assign(new Error("too-large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", function () {
      if (!chunks.length) { resolve({}); return; }
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")) || {}); }
      catch (error) { resolve({}); }
    });
    req.on("error", reject);
  });
}

function allowsFetch(req) {
  return String(req.headers["x-requested-with"] || "") === "fetch";
}

function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function newToken() {
  return crypto.randomBytes(32).toString("base64url");
}

module.exports = {
  send: send,
  cookies: cookies,
  sessionCookie: sessionCookie,
  clearCookie: clearCookie,
  clientHash: clientHash,
  readBody: readBody,
  allowsFetch: allowsFetch,
  tokenHash: tokenHash,
  newToken: newToken,
  COOKIE: COOKIE
};

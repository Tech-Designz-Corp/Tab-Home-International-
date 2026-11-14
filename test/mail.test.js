"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const mail = require("../server/lib/mail");

test("the letter escapes text typed into a form", function () {
  const html = mail.letter("Title", "Intro", [{ label: "Name", value: "<script>alert(1)</script>" }]);
  assert.equal(html.includes("<script>"), false);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /Tabitha's Home International/);
});

test("mail is skipped when Resend is not configured", async function () {
  const previous = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  const result = await mail.deliver({ to: ["person@example.com"], subject: "Test", html: "<p>Test</p>" });
  if (previous) process.env.RESEND_API_KEY = previous;
  assert.equal(result.sent, false);
  assert.equal(result.reason, "not-configured");
});

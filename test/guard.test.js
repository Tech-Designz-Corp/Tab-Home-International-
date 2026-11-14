"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { email, password, text, MEMBERSHIP_TYPES, FORM_TYPES } = require("../server/lib/guard");

test("email is trimmed and lowercased", function () {
  assert.equal(email("  Person@Example.com "), "person@example.com");
});

test("email rejects a value that is not an address", function () {
  assert.equal(email("not-an-email"), null);
  assert.equal(email(""), null);
});

test("password accepts 10 to 72 characters", function () {
  assert.equal(password("short"), null);
  assert.equal(password("long-enough"), "long-enough");
  assert.equal(password("x".repeat(73)), null);
});

test("text rejects an over-long value and keeps a blank optional value", function () {
  assert.equal(text("  Ada  ", 10), "Ada");
  assert.equal(text("too many characters", 4), null);
  assert.equal(text(undefined, 10), "");
});

test("membership and form types stay on the allowlists", function () {
  assert.ok(MEMBERSHIP_TYPES.indexOf("General Member") !== -1);
  assert.ok(FORM_TYPES.indexOf("contact") !== -1);
  assert.equal(FORM_TYPES.indexOf("membership"), -1);
});

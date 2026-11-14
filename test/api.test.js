"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("http");
const app = require("../api");

function call(method, path, headers, body) {
  return new Promise(function (resolve, reject) {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", function () {
      const port = server.address().port;
      fetch("http://127.0.0.1:" + port + path, {
        method: method,
        headers: headers,
        body: body
      }).then(function (res) {
        return res.text().then(function (text) {
          server.close(function () {
            resolve({ status: res.status, text: text });
          });
        });
      }).catch(function (error) {
        server.close(function () { reject(error); });
      });
    });
  });
}

test("Express rejects a form post that did not come from the site script", async function () {
  const res = await call("POST", "/api/forms", { "Content-Type": "application/json" }, "{}");
  assert.equal(res.status, 400);
  assert.match(res.text, /not sent/);
});

test("Express reports that the database is not connected", async function () {
  delete process.env.MYSQL_HOST;
  const res = await call("POST", "/api/signup", {
    "Content-Type": "application/json",
    "X-Requested-With": "fetch"
  }, JSON.stringify({ name: "Ada", email: "ada@example.com", password: "long-enough", membershipType: "General Member" }));
  assert.equal(res.status, 503);
});

test("the staff submission list requires the query token", async function () {
  const res = await call("GET", "/api/submissions");
  assert.equal(res.status, 401);
});

test("an unknown API path is not a page", async function () {
  const res = await call("GET", "/api/missing");
  assert.equal(res.status, 404);
});

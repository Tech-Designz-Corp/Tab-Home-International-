"use strict";

const express = require("express");
const { send } = require("../server/lib/http");
const forms = require("../server/routes/forms");
const signup = require("../server/routes/signup");
const login = require("../server/routes/login");
const logout = require("../server/routes/logout");
const account = require("../server/routes/account");
const password = require("../server/routes/password");
const deleteAccount = require("../server/routes/delete-account");
const submissions = require("../server/routes/submissions");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));

function mount(path, handler) {
  app.all(path, handler);
  app.all("/api" + path, handler);
}

mount("/forms", forms);
mount("/signup", signup);
mount("/login", login);
mount("/logout", logout);
mount("/account", account);
mount("/password", password);
mount("/delete-account", deleteAccount);
mount("/submissions", submissions);

app.use(function (req, res) {
  send(res, 404, { error: "Not found." });
});

app.use(function (error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error && (error.type === "entity.too.large" || error.status === 413)) {
    return send(res, 413, { error: "The request was not completed." });
  }
  console.error(error && error.code ? error.code : "request failed");
  send(res, 500, { error: "The request was not completed." });
});

module.exports = app;

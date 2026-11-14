"use strict";

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const caPath = path.join(__dirname, "isrgrootx1.pem");

function configured() {
  return Boolean(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD && process.env.MYSQL_DATABASE);
}

function connect() {
  const options = {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 4000),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectTimeout: 10000,
    dateStrings: true
  };
  if (process.env.MYSQL_SSL !== "0") {
    options.ssl = {
      ca: fs.readFileSync(caPath),
      minVersion: "TLSv1.2",
      rejectUnauthorized: true
    };
  }
  return mysql.createConnection(options);
}

async function query(sql, params) {
  const connection = await connect();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    await connection.end();
  }
}

module.exports = { configured, connect, query };

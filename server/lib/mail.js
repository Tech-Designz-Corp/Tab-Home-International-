"use strict";

const fs = require("fs");
const path = require("path");

const SITE = "https://www.tabithashomeintl.org";
const ORG = "info@tabithashomeintl.org";
const logoPath = path.join(__dirname, "..", "..", "assets", "Logo.png");

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function letter(title, intro, rows) {
  const details = (rows || []).map(function (row) {
    return "<tr><td style=\"padding:8px 0;font-family:Segoe UI,sans-serif;font-size:14px;color:#6b7c8e;width:160px;vertical-align:top;\">" +
      escapeHtml(row.label) +
      "</td><td style=\"padding:8px 0;font-family:Segoe UI,sans-serif;font-size:16px;color:#1f3247;\">" +
      escapeHtml(row.value) +
      "</td></tr>";
  }).join("");
  return "<!DOCTYPE html><html><body style=\"margin:0;background:#f4f9fd;\">" +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f4f9fd;padding:32px 12px;\">" +
    "<tr><td align=\"center\">" +
    "<table role=\"presentation\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:600px;width:100%;background:#ffffff;border:1px solid #d6e6f3;border-radius:16px;\">" +
    "<tr><td align=\"center\" style=\"background:#0f2742;padding:28px 32px 22px;\">" +
    "<img src=\"cid:tabitha-logo\" width=\"150\" alt=\"Tabitha's Home International\" style=\"display:block;margin:0 auto 12px;border:0;\">" +
    "<p style=\"margin:0;font-family:Georgia,serif;font-size:22px;color:#ffffff;\">Tabitha's Home International</p>" +
    "<p style=\"margin:6px 0 0;font-family:Segoe UI,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#b6d4ea;\">Unto the Least of These</p>" +
    "</td></tr>" +
    "<tr><td style=\"height:4px;background:#c9a86a;font-size:0;line-height:0;\">&nbsp;</td></tr>" +
    "<tr><td style=\"padding:32px;\">" +
    "<h1 style=\"margin:0 0 12px;font-family:Georgia,serif;font-size:28px;line-height:1.2;color:#14314f;\">" + escapeHtml(title) + "</h1>" +
    "<p style=\"margin:0 0 18px;font-family:Segoe UI,sans-serif;font-size:16px;line-height:1.6;color:#46586b;\">" + escapeHtml(intro) + "</p>" +
    "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" + details + "</table>" +
    "</td></tr>" +
    "<tr><td style=\"padding:18px 32px 22px;background:#f7fafc;font-family:Segoe UI,sans-serif;font-size:12px;line-height:1.6;color:#6b7c8e;\">" +
    "This is an automated email. It is not a promise that a staff member will reply. " +
    "<a href=\"" + SITE + "/privacy.html\" style=\"color:#4f86b8;\">Privacy</a> · " +
    "<a href=\"" + SITE + "/terms.html\" style=\"color:#4f86b8;\">Terms</a>" +
    "</td></tr></table></td></tr></table></body></html>";
}

function logoAttachment() {
  try {
    return [{
      filename: "Logo.png",
      content: fs.readFileSync(logoPath).toString("base64"),
      content_id: "tabitha-logo"
    }];
  } catch (error) {
    return [];
  }
}

function fromAddress() {
  return process.env.MAIL_FROM || "Tabitha's Home International <" + ORG + ">";
}

function orgRecipients() {
  const raw = process.env.MAIL_TO || ORG;
  return raw.split(",").map(function (item) { return item.trim(); }).filter(Boolean);
}

async function deliver(message) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "not-configured" };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: message.to,
      subject: message.subject,
      html: message.html,
      reply_to: message.replyTo || undefined,
      attachments: logoAttachment()
    })
  });
  if (!response.ok) {
    console.error("resend", response.status);
    return { sent: false, reason: "provider" };
  }
  return { sent: true };
}

function copyFor(kind) {
  if (kind === "newsletter") {
    return {
      orgSubject: "New email-update request",
      visitorSubject: "Your email-update request was received",
      visitorIntro: "The request is stored. This is not a recurring newsletter, and it does not mean a staff member will contact you."
    };
  }
  if (kind === "member") {
    return {
      orgSubject: "New member account",
      visitorSubject: "Your member account was created",
      visitorIntro: "The account is created. This email does not mean a staff member will contact you."
    };
  }
  return {
    orgSubject: "New website request",
    visitorSubject: "Your request was received",
    visitorIntro: "The request is stored. This email does not mean a staff member will contact you."
  };
}

async function deliverBatch(messages) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !messages.length) return { sent: false, reason: "not-configured" };
  const attachments = logoAttachment();
  const response = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(messages.map(function (message) {
      return {
        from: fromAddress(),
        to: message.to,
        subject: message.subject,
        html: message.html,
        reply_to: message.replyTo || undefined,
        attachments: attachments
      };
    }))
  });
  if (!response.ok) {
    console.error("resend", response.status);
    return { sent: false, reason: "provider" };
  }
  return { sent: true };
}

async function notify(options) {
  const copy = copyFor(options.kind);
  const rows = options.fields || [];
  const messages = [
    {
      to: orgRecipients(),
      replyTo: options.visitorEmail,
      subject: copy.orgSubject,
      html: letter(copy.orgSubject, "A website form saved this information.", rows)
    }
  ];
  if (options.visitorEmail) {
    messages.push({
      to: [options.visitorEmail],
      subject: copy.visitorSubject,
      html: letter(copy.visitorSubject, copy.visitorIntro, rows.filter(function (row) {
        return row.label !== "Note";
      }))
    });
  }
  return deliverBatch(messages).catch(function () { return { sent: false, reason: "provider" }; });
}

module.exports = { escapeHtml: escapeHtml, letter: letter, deliver: deliver, notify: notify };

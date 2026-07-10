import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(express.json({ limit: "20kb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/contact", limiter);

fs.mkdirSync("data", { recursive: true });

const db = new Database("data/contact-submissions.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    other_phone TEXT,
    service TEXT NOT NULL,
    message TEXT NOT NULL,
    ip_address TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const allowedServices = [
  "Software repair",
  "Website or application problem",
  "Database or reporting problem",
  "Legacy system support",
  "Automation",
  "Computer training",
  "Other",
];

function clean(value) {
  return String(value || "").trim();
}

function hasHtml(value) {
  return /<[^>]*>/g.test(value);
}

function countLinks(value) {
  return (value.match(/https?:\/\/|www\./gi) || []).length;
}

function isValidName(value) {
  return /^[A-Za-z]{1,50}$/.test(value);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isValidPhone(value) {
  return value === "" || /^(\d{10}|\d{3}-\d{3}-\d{4})$/.test(value);
}

function validateContact(data) {
  const errors = [];

  const allFields = [
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.otherPhone,
    data.service,
    data.message,
  ];

  if (allFields.some(hasHtml)) {
    errors.push("HTML is not allowed.");
  }

  if (!isValidName(data.firstName)) errors.push("Invalid first name.");
  if (!isValidName(data.lastName)) errors.push("Invalid last name.");
  if (!isValidEmail(data.email)) errors.push("Invalid email.");
  if (!isValidPhone(data.phone)) errors.push("Invalid phone.");
  if (!isValidPhone(data.otherPhone)) errors.push("Invalid other phone.");

  if (!allowedServices.includes(data.service)) {
    errors.push("Invalid service selected.");
  }

  if (data.message.length < 20 || data.message.length > 2000) {
    errors.push("Message must be 20-2000 characters.");
  }

  if (countLinks(data.message) > 2) {
    errors.push("Too many links.");
  }

  return errors;
}

app.post("/api/contact", (req, res) => {
  const data = {
    firstName: clean(req.body.firstName),
    lastName: clean(req.body.lastName),
    email: clean(req.body.email),
    phone: clean(req.body.phone),
    otherPhone: clean(req.body.otherPhone),
    service: clean(req.body.service),
    message: clean(req.body.message),
    website: clean(req.body.website),
  };

  if (data.website) {
    return res.status(200).json({ ok: true });
  }

  const errors = validateContact(data);

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const stmt = db.prepare(`
    INSERT INTO contact_submissions
    (
      first_name,
      last_name,
      email,
      phone,
      other_phone,
      service,
      message,
      ip_address
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.otherPhone,
    data.service,
    data.message,
    req.ip
  );

  return res.status(200).json({ ok: true });
});

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  next();
}

app.get("/api/admin/contact-submissions", requireAdmin, (req, res) => {
  const search = clean(req.query.search || "");

  let rows;

  if (search) {
    rows = db.prepare(`
      SELECT
        id,
        created_at,
        first_name,
        last_name,
        email,
        phone,
        service,
        substr(message, 1, 120) AS message_preview
      FROM contact_submissions
      WHERE
        first_name LIKE ?
        OR last_name LIKE ?
        OR email LIKE ?
        OR service LIKE ?
      ORDER BY id DESC
      LIMIT 100
    `).all(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  } else {
    rows = db.prepare(`
      SELECT
        id,
        created_at,
        first_name,
        last_name,
        email,
        phone,
        service,
        substr(message, 1, 120) AS message_preview
      FROM contact_submissions
      ORDER BY id DESC
      LIMIT 100
    `).all();
  }

  res.json({ ok: true, submissions: rows });
});

app.get("/api/admin/contact-submissions/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);

  const row = db.prepare(`
    SELECT *
    FROM contact_submissions
    WHERE id = ?
  `).get(id);

  if (!row) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }

  res.json({ ok: true, submission: row });
});

app.listen(PORT, () => {
  console.log(`Contact server running on port ${PORT}`);
});
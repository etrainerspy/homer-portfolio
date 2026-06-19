import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json({ limit: "20kb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/contact", limiter);

function hasHtml(value) {
  return /<[^>]*>/g.test(value);
}

function countLinks(value) {
  return (value.match(/https?:\/\/|www\./gi) || []).length;
}

function clean(value) {
  return String(value || "").trim();
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

  if (!isValidName(data.firstName)) errors.push("Invalid first name.");
  if (!isValidName(data.lastName)) errors.push("Invalid last name.");
  if (!isValidEmail(data.email)) errors.push("Invalid email.");
  if (!isValidPhone(data.phone)) errors.push("Invalid phone.");
  if (!isValidPhone(data.otherPhone)) errors.push("Invalid other phone.");
  if (!data.service) errors.push("Service is required.");

  if (data.message.length < 20 || data.message.length > 2000) {
    errors.push("Message must be 20-2000 characters.");
  }

  if (hasHtml(data.message)) {
    errors.push("HTML is not allowed.");
  }

  if (countLinks(data.message) > 2) {
    errors.push("Too many links.");
  }

  return errors;
}

app.post("/api/contact", async (req, res) => {
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

  // Honeypot: pretend success but do not send email
  if (data.website) {
    return res.status(200).json({ ok: true });
  }

  const errors = validateContact(data);

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const safeSubject = `Website Contact: ${data.service.replace(/[\r\n]/g, "")}`;

  const emailBody = `
New Mango Peel Website Contact

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Other Phone: ${data.otherPhone}
Service: ${data.service}

Message:
${data.message}
`;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Mango Peel Website" <${process.env.SMTP_USER}>`,
      to: "barter@mangopeel.site",
      replyTo: data.email,
      subject: safeSubject,
      text: emailBody,
    });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: "Email failed." });
  }
});

app.listen(3001, () => {
  console.log("Contact server running on port 3001");
});

/*  
  } catch (err) {
    console.error("Email send failed:");
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});
*/
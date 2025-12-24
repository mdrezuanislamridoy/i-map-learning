console.log("🚀 Script started");

import dotenv from "dotenv";
console.log("📦 Dotenv imported");

dotenv.config();
console.log("⚙️ Dotenv configured");

console.log("📧 Gmail user:", process.env.GMAIL_USER);
console.log("🔑 Password exists:", !!process.env.GMAIL_PASSWORD);

import imaps from "imap-simple";
console.log("📦 IMAP imported");

const config = {
  imap: {
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_PASSWORD,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: { rejectUnauthorized: false },
  },
};

console.log("🔧 Config created");
console.log("🔗 Attempting connection...");

imaps.connect(config)
  .then(() => {
    console.log("✅ Connected successfully");
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
  });
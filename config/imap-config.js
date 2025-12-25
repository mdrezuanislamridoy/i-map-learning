import "dotenv/config";

export const config = {
  imap: {
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_APP_PASS,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: { rejectUnauthorized: false },
  },
};

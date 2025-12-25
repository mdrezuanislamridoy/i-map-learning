import express from "express";
import { fetchEmails } from "./utils/fetchEmails-imap.js";

const app = express();

const emails = ["ridoy.babu.781@gmail.com", "sbsandelbuzz@gmail.com"];

fetchEmails(emails);

app.listen(3000, () => {
  console.log(`server is running on port : 3000`);
});

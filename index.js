import imaps from "imap-simple";
import "dotenv/config";
import express from "express";

const app = express();

const config = {
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

function getAttachments(struct, attachments = []) {
  for (const item of struct) {
    if (Array.isArray(item)) getAttachments(item, attachments);
    else if (item.disposition?.type === "ATTACHMENT") attachments.push(item);
  }
  return attachments;
}

const emails = ["ridoy.babu.781@gmail.com", "sbsandelbuzz@gmail.com"];

async function fetchEmails() {
  try {
    const connection = await imaps.connect(config);

    await connection.openBox("INBOX");

    await Promise.all(
      emails.map(async (email) => {
        const searchCriteria = [["FROM", email]];
        const fetchOptions = { bodies: [""], struct: true, markSeen: false };
        const messages = await connection.search(searchCriteria, fetchOptions);

        // await Promise.all(
        //   messages.map(async (item) => {
        //     const parsed = await simpleParser(item.parts[0].body);
        //     console.log({
        //       from: parsed.from?.text || "Unknown",
        //       subject: parsed.subject || "No Subject",
        //       date: parsed.date || "No Date",
        //       text: (parsed.text || "").substring(0, 200),
        //     });
        //   })
        // );

        var attachments = [];

        messages.forEach(function (message) {
          var parts = imaps.getParts(message.attributes.struct);
          attachments = attachments.concat(
            parts
              .filter(function (part) {
                return (
                  part.disposition &&
                  part.disposition.type.toUpperCase() === "ATTACHMENT"
                );
              })
              .map(function (part) {
                return connection
                  .getPartData(message, part)
                  .then(function (partData) {
                    return {
                      filename: part.disposition.params.filename,
                      data: partData,
                    };
                  });
              })
          );
        });

        const resolvedAttachments = await Promise.all(attachments);

        resolvedAttachments.forEach((attachment) => {
          console.log(
            `Email from ${email} has attachment: ${attachment.filename}`
          );
        });
      })
    );

    connection.end();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

fetchEmails();

app.listen(3000, () => {
  console.log(`server is running on port : 3000`);
});

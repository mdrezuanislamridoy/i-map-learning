import imaps from "imap-simple";
import { config } from "../config/imap-config.js";
import uploadPdfToCloudinary from "./uploadToCloud.js";

export async function fetchEmails(emails) {
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
              .map(async function (part) {
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

        resolvedAttachments.forEach(async (attachment) => {
          const result = await uploadPdfToCloudinary(
            attachment.data,
            attachment.filename
          );

          console.log(result.secure_url);

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

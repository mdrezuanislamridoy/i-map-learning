
import mime from "mime-types";
import cloudinary from "../config/cloudinary.js";

export default function uploadPdfToCloudinary(buffer, originalName) {
  const ext = originalName.includes(".")
    ? originalName.split(".").pop()
    : mime.extension(mime.lookup(buffer) || "") || "bin";

  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw",
          folder: "email-files",
          public_id: safeName, 
          use_filename: true,
          unique_filename: false,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      )
      .end(buffer);
  });
}

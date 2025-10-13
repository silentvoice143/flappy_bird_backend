import multer, { FileFilterCallback, Multer, StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";

/**
 * Multer utility for uploading images, PDFs, or both.
 *
 * @param {"image" | "pdf" | "both"} fileType - Allowed file types
 * @param {string} folderName - Folder where files will be uploaded
 * @param {number} maxSizeMB - Maximum allowed file size in MB (default: 10)
 */
export const createMulterUpload = (
  fileType = "both",
  folderName = "uploads",
  maxSizeMB = 10
) => {
  // 1️⃣ Build the absolute path to the upload folder
  const uploadPath = path.join(process.cwd(), folderName);

  // 2️⃣ Create the folder if it doesn't exist
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

  // 3️⃣ Configure storage settings for multer
  const storage = multer.diskStorage({
    // Destination folder for uploaded files
    destination: (req, file, cb) => cb(null, uploadPath),

    // File naming logic: original file name + timestamp + original extension
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // get file extension
      const baseName = path.basename(file.originalname, ext); // get file name without extension
      cb(null, `${baseName}-${Date.now()}${ext}`); // e.g., bird-1712345678901.png
    },
  });

  // 4️⃣ Allowed MIME types for images
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  // Allowed MIME type for PDFs
  const allowedPdfType = "application/pdf";

  // 5️⃣ File filter function to validate type
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const isImage = allowedImageTypes.includes(file.mimetype);
    const isPdf = file.mimetype === allowedPdfType;

    // Allow files based on the specified fileType option
    if (
      (fileType === "image" && isImage) ||
      (fileType === "pdf" && isPdf) ||
      (fileType === "both" && (isImage || isPdf))
    ) {
      cb(null, true); // accept the file
    } else {
      cb(
        new Error("Invalid file type. Only images or PDFs allowed.") as any,
        false
      ); // reject file
    }
  };

  // 6️⃣ Set max file size in bytes
  const limits = { fileSize: maxSizeMB * 1024 * 1024 };

  // 7️⃣ Return the multer instance with the above configuration
  return multer({ storage, fileFilter, limits });
};

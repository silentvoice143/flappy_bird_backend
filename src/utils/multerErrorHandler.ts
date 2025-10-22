import { Request, Response, NextFunction } from "express";

export const handleMulterErrors =
  (uploadInstance: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    uploadInstance(req, res, (err: any) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "File too large. Max size exceeded." });
        }
        if (err.message.includes("Invalid file type")) {
          return res.status(400).json({ message: err.message });
        }
        return res
          .status(500)
          .json({ message: "Upload error", error: err.message });
      }
      next();
    });
  };

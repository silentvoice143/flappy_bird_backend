import { CustomException } from "./custom-exception";
import { Request, Response, NextFunction } from "express";

export const globalException = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomException) {
    return res.status(err.getStatus()).json({ message: err.message });
    // or err.getMessage() if you kept your own msg field
  }

  console.error(err); // log for debugging
  return res.status(500).json({ message: "Internal server error" });
};

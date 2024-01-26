import { Request, Express, Response, NextFunction } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

type MulterFile = Express.Multer.File;

const storage = multer.diskStorage({
  destination: (req: Request, file: MulterFile, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(__dirname, "../../../uploads");
    cb(null, uploadDir);
  },
  filename: (req: Request, file: MulterFile, cb: (error: Error | null, filename: string) => void) => {
    const originalName = file.originalname;
    const fileExtension = originalName.split(".").pop();
    const filename = `${Date.now()}-${uuidv4()}.${fileExtension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });
export default upload;
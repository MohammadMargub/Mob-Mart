import multer, { StorageEngine } from "multer";
import { ObjectId } from "mongodb";
import { Request } from "express";
import path from "path";
import fs from "fs";

interface RequestWithFile extends Request {
  file: Express.Multer.File;
}

const destination = "./src/uploads";
if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, destination);
  },

  filename(_req, file, callback) {
    const id = new ObjectId().toString();
    const extName = path.extname(file.originalname).toLowerCase(); // Use path.extname for safe extraction
    callback(null, `${id}${extName}`);
  }
});

const fileFilter = (
  _req: RequestWithFile,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isValid =
    allowedTypes.test(file.mimetype) &&
    allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) {
    callback(null, true);
  } else {
    callback(new Error("Invalid file type. Only JPEG, PNG, or GIF files are allowed."));
  }
};

export const singleUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
}).single("photo");

import multer, { StorageEngine } from "multer";
import { ObjectId } from "mongodb";
import { Request } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

interface RequestWithFile extends Request {
  file: Express.Multer.File;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const destination = path.resolve(__dirname, "../uploads");
if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination(_req, _file, callback) {
    console.log("Saving file to destination:", destination);
    callback(null, destination);
  },

  filename(_req, file, callback) {
    const id = new ObjectId().toString();
    const extName = path.extname(file.originalname).toLowerCase();
    callback(null, `${id}${extName}`);
  }
});

const fileFilter = (
  _req: RequestWithFile,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  console.log("MIME Type:", file.mimetype);
  console.log("File Extension:", path.extname(file.originalname).toLowerCase());
  const isMimeTypeValid = /jpeg|jpg|png|gif/.test(file.mimetype);
  const isExtNameValid = /jpeg|jpg|png|gif/.test(path.extname(file.originalname).toLowerCase());

  if (isMimeTypeValid && isExtNameValid) {
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

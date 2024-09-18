import multer from "multer";
import { ObjectId } from "mongodb";

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, "./src/uploads");
  },

  filename(_req, file, callback) {
    const id = new ObjectId().toString();
    const extName = file.originalname.split(".").pop();
    callback(null, `${id}.${extName}`);
  }
});

export const singleUpload = multer({ storage }).single("photo");

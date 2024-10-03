import forge from "node-forge";
import { Request, Response, NextFunction } from "express";

const decryptData = (encrypted: string, secretKey: string): string => {
  const decoded = forge.util.decode64(encrypted);

  if (decoded.length < 16) {
    throw new Error("Invalid encrypted data");
  }

  const iv = forge.util.createBuffer(decoded.slice(0, 16));
  const encryptedData = forge.util.createBuffer(decoded.slice(16));

  const decipher = forge.cipher.createDecipher("AES-CBC", forge.util.createBuffer(secretKey));
  decipher.start({ iv });
  decipher.update(encryptedData);

  const result = decipher.finish();

  if (!result) {
    throw new Error("Decryption failed");
  }

  return decipher.output.toString();
};

export const decryptRequestBody = (req: Request, res: Response, next: NextFunction) => {
  const secretKey = process.env.SECRET_KEY ?? "default-secret";

  if (req.body.data) {
    try {
      const decryptedData = decryptData(req.body.data, secretKey);
      req.body = JSON.parse(decryptedData);
    } catch (error) {
      return res.status(400).json({ error: "Invalid encrypted data" });
    }
  }
  next();
};

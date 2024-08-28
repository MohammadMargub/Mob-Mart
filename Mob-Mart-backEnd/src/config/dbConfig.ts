import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../../.env");
console.log("Loading .env file from:", envPath);
dotenv.config({ path: envPath });

console.log("DB_HOST:", process.env.DB_URL);
console.log("DB_NAME:", process.env.DB_NAME);

const { DB_URL, DB_NAME } = process.env;

if (!DB_URL || !DB_NAME) {
  throw new Error("Missing DB_HOST or DB_NAME environment variables.");
}

export { DB_URL, DB_NAME };

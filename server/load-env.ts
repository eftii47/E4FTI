// Load environment variables FIRST before any other imports
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
}

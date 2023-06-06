import { config } from "dotenv";
config();
export const PORT = process.env.PORT || 3000,
  DB_HOST = process.env.DB_HOST || "containers-us-west-92.railway.app",
  DB_PORT = process.env.DB_PORT || 6079,
  DB_USER = process.env.DB_USER || "root",
  DB_PASSWORD = process.env.DB_PASSWORD || "7jPrgK5UK9jzfOkRSBfX",
  DB_DATABASE = process.env.DB_DATABASE || "railway";

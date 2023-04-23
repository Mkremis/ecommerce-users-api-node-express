import { config } from "dotenv";
config();
export const PORT = process.env.PORT || 3000,
  DB_HOST = process.env.DB_HOST || "localhost",
  DB_PORT = process.env.DB_PORT || 3306,
  DB_USER = process.env.DB_USER || "root",
  DB_PASSWORD = process.env.DB_PASSWORD || "433216",
  DB_DATABASE = process.env.DB_DATABASE || "usersdb";

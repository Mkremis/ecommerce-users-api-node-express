import { config } from "dotenv";
config();
export const PORT = process.env.PORT || 3000,
  DB_HOST = process.env.DB_HOST,
  DB_PORT = process.env.DB_PORT,
  DB_USER = process.env.DB_USER,
  DB_PASSWORD = process.env.DB_PASSWORD,
  DB_DATABASE = process.env.DB_DATABASE,
  MERCADOPAGO_API_KEY = process.env.MERCADOPAGO_TOKEN;

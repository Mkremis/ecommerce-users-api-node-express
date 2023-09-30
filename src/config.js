import { config } from "dotenv";
config();

export const DB_TYPE = process.env.DB_TYPE || "postgres";
export const PORT = process.env.PORT || 3000;
export const POSTGRES_URL = process.env.POSTGRES_URL;
export const MERCADOPAGO_API_KEY = process.env.MERCADOPAGO_TOKEN;

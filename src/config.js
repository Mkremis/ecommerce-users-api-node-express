import { config } from "dotenv";
config();

export const DB_TYPE = process.env.DB_TYPE;

export const PORT = process.env.PORT || 8090;

export const MONGODB_URL = process.env.MONGODB_URL;

export const MYSQL_HOST = process.env.MYSQL_HOST;
export const MYSQL_USER = process.env.MYSQL_USER;
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;
export const MERCADOPAGO_API_KEY = process.env.MERCADOPAGO_TOKEN;

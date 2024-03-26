import { PORT } from "./config.js";
import app from "./app.js";

import { DB_TYPE } from "./config.js";
import MySQLAdapter from "./adapters/mysql.js";
import PostgreSQLAdapter from "./adapters/postgres.js";
import MongoDBAdapter from "./adapters/mongodb.js";

async function initializeDB() {
  try {
    if (DB_TYPE === "mysql") {
      return new MySQLAdapter();
    } else if (DB_TYPE === "postgres") {
      return new PostgreSQLAdapter();
    } else if (DB_TYPE === "mongodb") {
      return new MongoDBAdapter();
    } else {
      throw new Error(`DB_TYPE "${DB_TYPE}" no es compatible.`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function initializeServer() {
  try {
    // Inicia la base de datos
    const db = await initializeDB();

    // Inicia el servidor después de que la base de datos esté lista
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });

    return db; // Devuelve la base de datos
  } catch (error) {
    console.error(error);
  }
}

const dbPromise = initializeServer();

export default dbPromise;

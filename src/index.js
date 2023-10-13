import { PORT } from "./config.js";
import app from "./app.js";

import { DB_TYPE } from "./config.js";
import MySQLAdapter from "./adapters/mysql.js";
import PostgreSQLAdapter from "./adapters/postgres.js";
// import { MongoDBAdapter } from "./adapters/mongodb.js";

async function initializeServer() {
  try {
    let db;

    if (DB_TYPE === "mysql") {
      db = new MySQLAdapter(); // Inicializa el adaptador MySQL
    } else if (DB_TYPE === "postgres") {
      db = new PostgreSQLAdapter(); // Inicializa el adaptador PostgreSQL
    } else if (DB_TYPE === "mongodb") {
      db = new MongoDBAdapter(); // Inicializa el adaptador MongoDB
    } else {
      throw new Error(`DB_TYPE "${DB_TYPE}" no es compatible.`);
    }

    // Inicia el servidor después de que la base de datos esté lista
    await db; // Espera a que la base de datos esté lista
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

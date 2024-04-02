import { PORT } from "./config.js";
import app from "./app.js";

import { DB_TYPE } from "./config.js";
import MySQLAdapter from "./adapters/mysql.js";
import MongoDBAdapter from "./adapters/mongodb.js";
import PostgreSQLAdapter from "./adapters/PostgreSQL.js";

function initializeDB() {
  switch (DB_TYPE) {
    case "mysql":
      return new MySQLAdapter();
    case "mongodb":
      return new MongoDBAdapter();
    case "postgresql":
      return new PostgreSQLAdapter();
    default:
      console.error(`DB_TYPE "${DB_TYPE}" no es compatible.`);
      break;
  }
}

function initializeServer() {
  // Inicia la base de datos
  const dbInit = initializeDB();
  // Inicia el servidor después de que la base de datos esté lista
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });

  return dbInit; // Devuelve la base de datos
}

const db = initializeServer();

export default db;

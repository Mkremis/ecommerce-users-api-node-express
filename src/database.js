// database.js
import { DB_TYPE } from "./config.js";
// import { MySQLAdapter } from "./adapters/mysql.js";
import PostgreSQLAdapter from "./adapters/postgres.js";
// import { MongoDBAdapter } from "./adapters/mongodb.js";

let db;

if (DB_TYPE === "mysql") {
  db = new MySQLAdapter(); // Carga el adaptador MySQL
} else if (DB_TYPE === "postgres") {
  db = new PostgreSQLAdapter(); // Carga el adaptador PostgreSQL
} else if (DB_TYPE === "mongodb") {
  db = new MongoDBAdapter(); // Carga el adaptador MongoDB
} else {
  throw new Error(`DB_TYPE "${DB_TYPE}" no es compatible.`);
}

export default db;

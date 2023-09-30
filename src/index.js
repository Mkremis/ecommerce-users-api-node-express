import { PORT } from "./config.js";
import app from "./app.js";
import PostgreSQLAdapter from "./adapters/postgres.js";

async function startServer() {
  try {
    const db = new PostgreSQLAdapter(); // Crear una instancia del adaptador PostgreSQL
    console.log("Connected to the database");

    // Inicia el servidor después de que la base de datos esté lista
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();

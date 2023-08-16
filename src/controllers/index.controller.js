import {
  describeDB,
  pong,
  showTables,
  createDB,
} from "../services/index.services.js";

export const ping = async (req, res) => {
  try {
    const pingResult = await pong();
    res.status(200).json(pingResult);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const tables = async (req, res) => {
  try {
    const tables = showTables();
    res.status(200).json({ tables });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const newDB = async (req, res) => {
  try {
    const tables = createDB();
    res.status(200).json({ tables });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const db = async (req, res) => {
  try {
    const { db } = req.params;
    const dataBase = await describeDB(db);
    res.status(200).json({ dataBase });
  } catch (error) {
    res.status(500).json({ error });
  }
};

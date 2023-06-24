import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fsPromises = fs.promises;

export const logEvents = async (message, fileName) => {
  const dateTime = `${format(new Date(), "MMyyyydd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", fileName),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

export const logger = (req, res, next) => {
  const message = `${req.method}\t${req.headers.origin}\t${req.url}\tStatus Code:${res.statusCode}\n`;
  console.log("logger", message);
  logEvents(message, "reqLog.txt");
  next();
};

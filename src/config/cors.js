const allowList = ["http://localhost:5173"]; // Aquí puedes agregar los orígenes permitidos

export default function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  if (allowList.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Intercept OPTIONS method
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  } else {
    next(); // Continuar sin CORS si no está en la lista permitida
  }
}

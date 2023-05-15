const encryptPass = (req, res, next)=>{
    // const passHash = encrypt(password);
    // obtiene los datos del usuario desde el cuerpo de la solicitud
  const userData = req.body;
  req.body = {...req.body, ...login[password]="qqqqqq"}
  next()
}
export {encryptPass}
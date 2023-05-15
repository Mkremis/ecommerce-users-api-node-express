const encryptPass = (req, res, next)=>{
    // const passHash = encrypt(password);
    // obtiene los datos del usuario desde el cuerpo de la solicitud
  let password = req.body.login.password;
 password= "qqqqqqqqqqq"
 res.locals.password = password;
  next()
}
export {encryptPass}
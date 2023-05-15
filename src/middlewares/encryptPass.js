import { encrypt, verified } from '../utils/bcrypt.handle';

const encryptPass = (req, res, next)=>{
    // const passHash = encrypt(password);
    // obtiene los datos del usuario desde el cuerpo de la solicitud
  let password = req.body.login.password;
  const passHash = encrypt(password);
 res.locals.password = passHash;
  next()
}
export {encryptPass}
import { encrypt, verified } from '../utils/bcrypt.handle';

const encryptPass = (req, res, next)=>{
  let password = req.body.login.password;
  const passHash = encrypt(password);
 res.locals.password = passHash;
  next()
}
export {encryptPass}
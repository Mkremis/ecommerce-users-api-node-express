import { encrypt, verified } from '../utils/bcrypt.handle';

const encryptPass = (req, res, next)=>{
  const password = req.body.login.password;
  const passHash = encrypt(password);
 res.locals.password = passHash;
  next()
}
export {encryptPass}
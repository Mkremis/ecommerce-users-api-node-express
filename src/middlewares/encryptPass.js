import { encrypt } from '../utils/bcrypt.handle';

const encryptPass =(req, res, next)=>{
    const pass = userData.login["password"];
    const passHash = encrypt(pass)
    res.locals.passhash = passHash;
    next();
}

export{encryptPass}
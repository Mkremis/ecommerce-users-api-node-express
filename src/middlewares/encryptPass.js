import {encrypt } from '../utils/bcrypt.handle';

const encryptPass =(req, res, next)=>{
    const pass = req.userData.login["password"];
    const passHash = encrypt(pass)
    res.locals.passhash = passHash;
    next();
}

export{encryptPass}
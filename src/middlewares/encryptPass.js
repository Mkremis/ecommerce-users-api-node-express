import { hash, compare } from 'bcryptjs';

const encryptPass =(req, res, next)=>{
    const pass = userData.login["password"];
    res.locals.passhash= hash(pass, 8);
    next();
}

export{encryptPass}
import { hash, compare } from 'bcryptjs';

const encryptPass =async(req, res, next)=>{
    const pass = userData.login["password"];
    res.locals.passhash= await hash(pass, 8);
    next();
}

export{encryptPass}
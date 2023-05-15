

const encryptPass =(req, res, next)=>{
    const pass = req.userData.login["password"];
    const passHash = "rrrrrrrrrrr"
    res.locals.passhash = "passHash";
    next();
}

export{encryptPass}
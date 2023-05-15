const encryptPass =(req, res, next)=>{
    res.locals.passhash="qqqqqqqqqq";
    next();
}

export{encryptPass}
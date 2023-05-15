const encryptPass =(req, res, next)=>{

    res.locals.passHash= "qqqqqqqqqq"
    next()
}

export{encryptPass}
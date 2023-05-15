


const encryptPass = (req, res, next)=>{
  const password = req.body.login.password;
  // res.locals.passHash = encrypt(password)
  next()
}
export {encryptPass}
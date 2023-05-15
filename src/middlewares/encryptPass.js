

const encryptPass = (req, res, next)=>{
  let password = req.body.login.password;
  const passHash = "qqqqqqqq";
 res.locals.password = passHash;
  next()
}
export {encryptPass}
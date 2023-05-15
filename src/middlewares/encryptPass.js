

const encryptPass = (req, res, next)=>{
  let password = req.body.login.password;
 res.locals.password = "qqqqqqqq";
  next()
}
export {encryptPass}
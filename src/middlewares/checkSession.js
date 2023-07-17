import { verifyRefreshToken, verifyToken } from "../utils/jwtHandle.js";

const checkSession = async (req, res, next) => {
  
  const {refreshToken, accessToken } = req.cookies
  console.log(refreshToken, accessToken)
  //const {refreshToken} = req.body;
 // const jwtByUser = req.headers.authorization || "";
  //const accessToken = jwtByUser.split(" ").pop(); //['Bearer','11111']
  const isUser = verifyToken(`${accessToken}`);
  if (isUser.success) {
      req.user = isUser.success;
      next();
    }else{
      const isVerifiedUser = verifyRefreshToken(refreshToken)
      if(isVerifiedUser.success){
        req.user = isVerifiedUser.success;
        next();
      }else{
        res.status(401);
        res.json({ message: "NO_TIENES_UNA_SESSION_VALIDA" });
      } 
    }
};
export { checkSession };

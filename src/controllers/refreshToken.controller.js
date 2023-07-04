import { getRefreshToken, getUserData} from "../services/auth.services.js";
import { accessJWT, verifyRefreshToken } from "../utils/jwtHandle.js";

export const handleRefreshToken = async (req, res) => {
  const {refreshToken} = req.body;
  if(!refreshToken) res.sendStatus(401)
  const response = verifyRefreshToken(refreshToken);
  if (response?.fail){
    res.sendStatus(401)
  }else{
    const {username} = response.success;
     const isRefreshToken = await getRefreshToken(username)
    if(!isRefreshToken || isRefreshToken?.refresh_token !== refreshToken){ 
      res.sendStatus(401)
      }else{
        const newAccessToken = accessJWT(username)
        const response = await getUserData(username)
        if(response.success){
          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          res.status(200).json({accessToken:newAccessToken, userData: response.success }) 
         }else{
          res.sendStatus(500)
         }
      }

  }
};

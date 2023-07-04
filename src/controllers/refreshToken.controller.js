import { getRefreshToken, getUserData, setRefreshToken } from "../services/auth.services.js";
import { refreshJWT, verifyRefreshToken } from "../utils/jwtHandle.js";

export const handleRefreshToken = async (req, res) => {
  const {refreshToken} = req.body;
  if(!refreshToken) res.sendStatus(401)
  const response = verifyRefreshToken(refreshToken);
  if (response?.fail){
    res.sendStatus(401)
  }else{
    const {newAccessToken, username} = response.success;
     const isRefreshToken = await getRefreshToken(username)
    if(!isRefreshToken){ 
      res.sendStatus(401)
      }else{
        const newRefreshToken = refreshJWT(username)
        await setRefreshToken(newRefreshToken)
        const {userData} = await getUserData(username)
       
        res.status(200).json({accessToken:newAccessToken, refreshToken: newRefreshToken, userData}) 
      }

  }
};

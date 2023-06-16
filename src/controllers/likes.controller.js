import { getUserLikes, likesUpdate } from "../services/likes.services.js";

//GET LIKES
export const getLikes = async (req, res) => {
  console.log("holaaaaaaaaaaaaaaaaaaaaaa");
  const { username } = req.params;
  try {
    const response = await getUserLikes({ username });
    res.status(200).json(response.success);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//PUT LIKES
export const updateLikes = async (req, res) => {
  const { username } = req.params;
  const likes = JSON.stringify(req.body);
  try {
    const response = await likesUpdate({ username, likes });
    res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

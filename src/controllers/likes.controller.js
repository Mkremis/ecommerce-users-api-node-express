import PostgreSQLAdapter from "../adapters/postgres.js";
const db = new PostgreSQLAdapter();

export const getLikes = async (req, res) => {
  const { username } = req.params;
  try {
    const response = await db.getUserLikes({ username });
    console.log(response);
    if (response.success)
      res.status(200).json(response.success.user_likes.likes);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateLikes = async (req, res) => {
  const { username } = req.params;
  const likes = JSON.stringify(req.body);
  try {
    const response = await db.updateUserLikes({ username, likes });
    if (response.success)
      res.status(200).json({ message: "Likes updated successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

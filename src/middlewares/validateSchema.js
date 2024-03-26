export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: error.errors.map((error) => error.message) });
  }
};

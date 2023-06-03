import bcryptjs from "bcryptjs";
const { compare, hash } = bcryptjs;
const encrypt = async (pass) => {
  const passwordHash = hash(pass, 8);
  return passwordHash;
};

const verified = (pass, passHash) => {
  const isCorrect = compare(pass, passHash);
  return isCorrect;
};

export { encrypt, verified };

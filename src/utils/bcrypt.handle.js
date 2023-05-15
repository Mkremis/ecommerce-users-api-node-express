import { hash, compare } from 'bcryptjs';

const encrypt = async (pass) => {
  const passwordHash = await hash(pass, 8);
  return passwordHash;
};

const verified = (pass, passHash) => {
  const isCorrect = compare(pass, passHash);
  return isCorrect;
};

export { encrypt, verified };
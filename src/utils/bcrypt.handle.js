import {hashSync} from 'bcryptjs';

const encrypt = (pass) => {
  const passwordHash = hashSync(pass, 8);
  return passwordHash;
};

const verified = (pass, passHash) => {
  const isCorrect = compare(pass, passHash);
  return isCorrect;
};

export { encrypt, verified };
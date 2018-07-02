import { ERR_AUTH_WRONG_CREDENCIALS } from '../utils/errors';

import UserModel from '../models/User';

export const getToken = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (username && password) {
      const user = await authenticateUser(username, password);
      res.status(200).json(user.generateToken());
    } else {
      next(ERR_AUTH_WRONG_CREDENCIALS);
    }
  } catch (err) {
    next(err);
  }
}

const authenticateUser = (username, password) => new Promise(async (resolve, reject) => {
  const user = await UserModel.findOne({ username });
  if (user && await user.passwordMatch(password)) {
    resolve(user);
  } else {
    reject(ERR_AUTH_WRONG_CREDENCIALS)
  }
});
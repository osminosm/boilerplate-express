import UserModel from '../models/User';

export const addUser = (req, res, next) => {
  createUser(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => next(err));
}

export const listUsers = (req, res, next) => {
  UserModel.getUsers()
    .then((users) => { res.status(users.length > 0 ? 200 : 204).json(users); })
    .catch(err => next(err));
}

export const editUser = (req, res, next) => {
  const userData = req.body;
  const { username } = req.params;
  UserModel.editUserByUserName(username, userData)
    .then(() => res.status(200).json({}))
    .catch(err => next(err));
}

export const deleteUser = (req, res, next) => {
  const { username, confirmUsername } = req.body;
  if (username === confirmUsername) {
    UserModel.deleteOne({ username }, (err) => {
      if (err) next(err);
      res.status(200).json({});
    });
  } else {
    next(new Error("validation"));
  }
}

const createUser = (userData) => {
  const user = new UserModel(userData);
  return user.save();
};
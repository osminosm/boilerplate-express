import UserModel from '../src/models/User';


export const createUser = (username, password, permissions = "") => new Promise((resolve, reject) => {
  if (typeof global.it !== 'function') console.log("Creating User:", { username, password, permissions });
  (new UserModel({ username, password, permissions })).save(() => { resolve() });
});

// clean ups

export const cleanUsers = () => new Promise((resolve, reject) => {
  UserModel.remove({}, () => {
    if (typeof global.it !== 'function') console.log("Cleaned collection: users.");
    resolve();
  });
});

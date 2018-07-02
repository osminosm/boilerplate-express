import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { bcryptSaltWorkFactor, jwtSecret } from '../utils/config';
import jwt from 'jsonwebtoken';


const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  permissions: { type: String, default: "" }
});

userSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(bcryptSaltWorkFactor, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.statics.getUsers = function () {
  return new Promise((resolve, reject) => {
    this.find({}, (err, users) => {
      if (!err && users) resolve(users)
      reject(err);
    }).select('-_id -password');
  })
}

userSchema.statics.editUserByUserName = function (username, userData) {
  return new Promise((resolve, reject) => {
    this.findOne({ username }).then((user) => {
      if (userData.username) delete userData.username; // should throw error ?
      if (userData.password) delete userData.password; // should throw error ?
      user.set(userData);
      user.save().then(() => {
        resolve();
      });
    });
  });
}

userSchema.methods.passwordMatch = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) reject(err);
      resolve(isMatch);
    });
  });
}

userSchema.methods.generateToken = function () {
  return {
    access_token: jwt.sign({
      userType: 'account',
      data: {
        username: this.username,
      },
      permissions: this.permissions
    }, jwtSecret)
  };
}

module.exports = mongoose.model('user', userSchema);
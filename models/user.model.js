const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      validate: {
        len: 5,
        isAlphanumeric: true,
        isUnique: (value, next) => {
          User.findAll({
            where: { username: value },
          }).then((user) => {
            if (user.length != 0) {
              next(new Error('username already in use'));
            }
            next();
          });
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        isUnique: (value, next) => {
          User.findAll({
            where: { email: value },
          }).then((email) => {
            if (email.length != 0) {
              next(new Error('email already in use'));
            }
            next();
          });
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'password required',
        },
        len: {
          args: 4,
          msg: 'Password must be longer than 4',
        },
      },
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebookId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    githubId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitterId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  User.prototype.validPasswordPromise = function (password) {
    return new Promise((resolve, reject) => {
      if (bcrypt.compareSync(password, this.password)) {
        resolve('password is valid');
      } else {
        reject('password invalid');
      }
    });
  };
  return User;
};

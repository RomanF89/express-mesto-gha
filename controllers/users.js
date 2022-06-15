const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { NotFoundError } = require('../errors/notFoundError');
const { BadRequestError } = require('../errors/badRequestError');
const { BadAuthError } = require('../errors/badAuthError');
const { ConflictingRequestError } = require('../errors/conflictingRequestError');

const getUsers = (_, res, next) => {
  User.find({}, {
    name: 1,
    avatar: 1,
    email: 1,
    about: 1,
  })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId, {
    name: 1,
    avatar: 1,
    email: 1,
    about: 1,
  })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('User not found'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Id is not correct'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const resUser = user.toObject();
      delete resUser.password;
      res.status(201).send(resUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        next(new BadRequestError(`${fields} are not correct`));
      }
      if (err.code === 11000) {
        next(new ConflictingRequestError('This email already exists'));
      }
      next(err);
    });
};

const upadateProfile = (req, res, next) => {
  const userId = req.user._id;
  const userName = req.body.name;
  const userAbout = req.body.about;

  return User.findByIdAndUpdate(userId, { name: userName, about: userAbout }, {
    new: true, runValidators: true,
  })
    .then((userData) => {
      const resUser = userData.toObject();
      delete resUser.password;
      res.send(resUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        next(new BadRequestError(`${fields} are not correct`));
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const userAvatar = req.body.avatar;

  return User.findByIdAndUpdate(userId, { avatar: userAvatar }, {
    new: true, runValidators: true,
  })
    .then((userData) => {
      const resUser = userData.toObject();
      delete resUser.password;
      res.send(resUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        next(new BadRequestError(`${fields} are not correct`));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('email or password not found'));
  }
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new BadAuthError('email or password are incorrect'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new BadAuthError('email or password are incorrect'));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key');
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ message: 'Success' })
        .end();
    })
    .catch((err) => {
      next(err);
    });
};

const getAuthorizedUser = (req, res, next) => {
  const authorizedUser = req.user._id;

  return User.findById(authorizedUser)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      }
      const resUser = user.toObject();
      delete resUser.password;
      res.send(resUser);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  upadateProfile,
  updateAvatar,
  login,
  getAuthorizedUser,
};

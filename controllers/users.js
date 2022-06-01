const User = require('../models/User');

const getUsers = (_, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(500).send({ message: 'Server error' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Id is not correct' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Name, about or avatar are not correct' });
  }

  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return res.status(400).send({ message: `${fields} are not correct` });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const upadateProfile = (req, res) => {
  const userId = req.user._id;
  const userName = req.body.name;
  const userAbout = req.body.about;

  if (!userName || !userAbout) {
    return res.status(400).send({ message: 'Name or about are not correct' });
  }

  return User.findByIdAndUpdate(userId, { name: userName, about: userAbout }, {
    new: true, runValidators: true,
  })
    .then((userData) => {
      res.status(200).send(userData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return res.status(400).send({ message: `${fields} are not correct` });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const userAvatar = req.body.avatar;

  if (!userAvatar) {
    return res.status(400).send({ message: 'user avatar is not correct' });
  }

  return User.findByIdAndUpdate(userId, { avatar: userAvatar }, {
    new: true, runValidators: true,
  })
    .then((userData) => {
      res.status(200).send(userData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return res.status(400).send({ message: `${fields} are not correct` });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  upadateProfile,
  updateAvatar,
};

const mongoose = require('mongoose');
const validation = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив-Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://avatars.mds.yandex.net/i?id=1be4416d747cb9a0c1f15955da100268-4828150-images-thumbs&n=13',
    validate: {
      validator(v) {
        return /^https{0,1}:\/\/(www\.){0,1}([a-z0-9-]\.?)+(\.(ru)|(com)|(net)){1}([^\w\W]|((\/[a-z0-9-._\]~:?#[@!&'()*+,;=$]+)+)?)$/.test(v);
      },
      message: (props) => `${props.value} URL is not correct!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validation.isEmail(v);
      },
      message: 'email is not correct!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('user', userSchema);

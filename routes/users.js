const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const {
  getUser,
  getUsers,
  upadateProfile,
  updateAvatar,
  getAuthorizedUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getAuthorizedUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.error('any.invalid');
    }),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), upadateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^https{0,1}:\/\/(www\.){0,1}([a-z0-9-]\.?)+(\.([a-z]{2,})){1}([^\w\W]|((\/[a-z0-9-._\]~:?#[@!&'()*+,;=$]+)+)?)$/),
  }),
}), updateAvatar);

module.exports.userRouter = router;

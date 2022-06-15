const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { userRouter } = require('./users');
const { cardRouter } = require('./cards');
const { auth } = require('../middlewares/auth');
const { NotFoundError } = require('../errors/notFoundError');
const {
  createUser,
  login,
} = require('../controllers/users');
const { urlRegex } = require('../validation/regex');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);

router.use('/cards', cardRouter);

router.use('/users', userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Sorry can't find that!"));
});

module.exports = router;

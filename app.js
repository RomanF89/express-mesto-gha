const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');
const {
  createUser,
  login,
} = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { NotFoundError } = require('./errors/notFoundError');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());

app.use(cookieParser());

app.listen(PORT, () => {
  console.log('server has been started');
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https{0,1}:\/\/(www\.){0,1}([a-z0-9-]\.?)+(\.([a-z]{2,})){1}([^\w\W]|((\/[a-z0-9-._\]~:?#[@!&'()*+,;=$]+)+)?)$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/cards', cardRouter);

app.use('/users', userRouter);

app.use((req, res, next) => {
  next(new NotFoundError("Sorry can't find that!"));
});

app.use(errors());

app.use((err, req, res, next) => {
  console.log(next);
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res.status(500).send({ message: 'Server error' });
});

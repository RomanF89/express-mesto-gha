const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');
const {
  createUser,
  login,
} = require('./controllers/users');
const { auth } = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());

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
    avatar: Joi.string().regex(/^https{0,1}:\/\/(www\.){0,1}([a-z0-9-]\.?)+(\.(ru)|(com)|(net)){1}([^\w\W]|((\/[a-z0-9-._\]~:?#[@!&'()*+,;=$]+)+)?)$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/cards', auth, cardRouter);

app.use('/users', auth, userRouter);

app.use(auth);

app.use((req, res) => {
  res.status(404).send({ message: "Sorry can't find that!" });
});

app.use(errors());

app.use((err, req, res, next) => {
  console.log(next);
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send({ message: 'Server error' });
});

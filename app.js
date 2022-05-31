const express = require('express');
const mongoose = require('mongoose');
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: '62965a37e155e0cd2a33f7a6' };

  next();
});

app.use('/cards', cardRouter);

app.use('/users', userRouter);

app.use((req, res) => {
  res.status(404).send({ message: "Sorry can't find that!" });
});

app.listen(PORT, () => {
  console.log('server has been started');
});

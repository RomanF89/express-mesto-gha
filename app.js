const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const routes = require('./routes/routes');
const errorsHandler = require('./middlewares/errorsHandler');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const { PORT = 3000 } = process.env;

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.listen(PORT, () => {
  console.log('server has been started');
});

app.use(routes);

app.use(errors());

app.use(errorsHandler);

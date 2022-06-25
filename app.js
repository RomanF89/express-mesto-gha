const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/routes');
const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const { PORT = 3000 } = process.env;

app.use(cors({ credentials: true, origin: 'http://localhost:3001' }));

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.listen(PORT, () => {
  console.log('server has been started');
});

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

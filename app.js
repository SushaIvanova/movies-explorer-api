require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_ADDRESS } = require('./config');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());

app.use(helmet());

const router = require('./routes/index');

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);

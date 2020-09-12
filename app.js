require('dotenv').config();
const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const cards = require('./routes/cards.js');
const users = require('./routes/users.js');
const { errorHandler } = require('./modules/errorHandler.js');
const { login, createUser } = require('./controllers/users.js');
const auth = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const BadRequestError = require('./errors/bad-request-err');

// eslint-disable-next-line consistent-return
const urlValidator = (link) => {
  if (!validator.isURL(link)) {
    throw new BadRequestError('Неправильный URL');
  }
  return link;
};

// const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser());
app.use(cookieParser());
app.use(requestLogger);

app.use('/cards', auth, cards);
app.use('/users', auth, users);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(urlValidator),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

// app.listen(PORT, () => {
//   // eslint-disable-next-line no-console
//   console.log(`App listening at http://localhost:${PORT}`);
// });

module.exports = app;

const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const cards = require('./routes/cards.js');
const users = require('./routes/users.js');
const { errorHandler } = require('./modules/errorHandler.js');
const { login, createUser } = require('./controllers/users.js');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

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

app.use('/cards', auth, cards);
app.use('/users', auth, users);
app.post('/signup', createUser);
app.post('/signin', login);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${PORT}`);
});

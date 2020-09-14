/* eslint-disable consistent-return */
const { AssertionError } = require('assert');
const { MongoError } = require('mongodb');

// eslint-disable-next-line no-unused-vars
module.exports.errorHandler = (error, req, res, next) => {
  if (error.name === 'DocumentNotFoundError') {
    return res.status(404).json({ message: 'Документ не найден' });
  }

  if (error instanceof AssertionError) {
    return res.status(400).json({
      type: 'AssertionError',
      message: error.message,
    });
  }

  if (error instanceof MongoError && error.code === 11000) {
    return res.status(409).json({
      type: 'MongoError',
      message: 'Пользователь с таким адресом электронной почты уже существует',
    });
  }

  if (error instanceof MongoError && error.code !== 11000) {
    return res.status(503).json({
      type: 'MongoError',
      message: error.message,
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }

  const { statusCode = 500, message } = error;

  res
    .status(statusCode)
    .send({
    // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};

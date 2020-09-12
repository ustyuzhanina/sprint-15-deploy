class UsedEmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = 'MongoError';
    this.code = 11000;
    this.message = 'Пользователь с таким адресом электронной почты уже существует!';
  }
}

module.exports = UsedEmailError;

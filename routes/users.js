const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const validator = require('validator');

const BadRequestError = require('../errors/bad-request-err');

// eslint-disable-next-line consistent-return
const urlValidator = (link) => {
  if (!validator.isURL(link)) {
    throw new BadRequestError('Неправильный URL');
  }
  return link;
};

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', celebrate({
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
  }).unknown(true),
}), getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
  }).unknown(true),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValidator),
  }),
}), updateAvatar);

module.exports = router;

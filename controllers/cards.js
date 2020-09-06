const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const PermissionError = require('../errors/permission-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards.length) {
        res.send(cards);
      } else {
        throw new NotFoundError('В базе данных еще нет ни одной карточки');
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .populate('owner', '_id')
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card.owner.id.toString() !== req.user._id) {
        // return res.status(403).json({ message: 'Запрещено' });
        throw new PermissionError('Запрещено');
      }
      card.remove()
        .then((document) => {
          res.send({ data: document });
        });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        // return res.status(404).send({ message: 'Карточка отсутствует в БД' });
        throw new NotFoundError('Карточка отсутствует в БД');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        // return res.status(404).send({ message: 'Карточка отсутствует в БД' });
        throw new NotFoundError('Карточка отсутствует в БД');
      }
      res.send({ data: card });
    })
    .catch(next);
};

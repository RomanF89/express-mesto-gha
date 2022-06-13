const Card = require('../models/Card');
const { NotFoundError } = require('../errors/notFoundError');
const { BadRequestError } = require('../errors/badRequestError');
const { BadAuthError } = require('../errors/badAuthError');

const getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  if (!name || !link) {
    next(new BadRequestError('Name or link are not correct'));
  }
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        next(new BadRequestError(`${fields} are not correct`));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const user = req.user._id;

  Card.findOne({ _id: cardId })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Card is not correct'));
      }
      if ((card.owner).toString() === user) {
        return Card.findByIdAndRemove(cardId)
          .then((currentCard) => {
            res.status(200).send({ message: `${currentCard.name} deleted` });
          });
      }
      return next(new BadAuthError('You are not card owner'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Card id is not correct'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  const user = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: user } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Card is not correct'));
      }
      return res.status(201).send({ message: `${card.name} liked` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Card id is not correct'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  const user = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: user } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Card is not correct'));
      }
      return res.status(200).send({ message: `${card.name} disliked` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Card id is not correct'));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

const Card = require('../models/Card');

const getCards = (_, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: 'Server error' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  console.log(name, link, owner);

  if (!name || !link) {
    return res.status(400).send({ message: 'Name or link are not correct' });
  }

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return res.status(400).send({ message: `${fields} are not correct` });
      }
      return res.status(500).send({ message: 'Id is not correct' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  const user = req.user._id;

  Card.findOne({ _id: cardId })
    .then((card) => {
      if ((card.owner).toString() === user) {
        Card.findByIdAndRemove(cardId)
          .then((card) => {
            res.status(200).send({ message: `${card.name} deleted` });
          });
      } else {
        return res.status(500).send({ message: 'You are not card owner' });
      }
    })
    .catch(() => {
      res.status(404).send({ message: 'Card not found or id is not correct' });
    });
};

const likeCard = (req, res) => {
  const user = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: user } }, { new: true })
    .then((card) => {
      res.status(201).send({ message: `${card.name} liked` });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        return res.status(404).send({ message: 'Card is not correct' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Card id not found' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const dislikeCard = (req, res) => {
  const user = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: user } }, { new: true })
    .then((card) => {
      res.status(200).send({ message: `${card.name} disliked` });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        return res.status(404).send({ message: 'Card is not correct' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Card id not found' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

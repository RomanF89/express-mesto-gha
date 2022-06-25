const jwt = require('jsonwebtoken');
const { BadAuthError } = require('../errors/badAuthError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(req.cookies);
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(new BadAuthError('Need authorization'));
  }
  req.user = payload;

  next();
};

module.exports = {
  auth,
};

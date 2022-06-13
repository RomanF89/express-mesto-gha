const jwt = require('jsonwebtoken');
const { BadAuthError } = require('../errors/badAuthError');

const auth = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie) {
    next(new BadAuthError('Need authorization'));
  }
  const token = cookie.replace('jwt=', '');
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

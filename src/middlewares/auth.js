const jwt = require('jsonwebtoken');

const HTTP_UNAUTHORIZED_STATUS = 401;

const TOKEN_ERROR = 'missing auth token';

const auth = (req, _res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    const err = new Error(TOKEN_ERROR);

    err.statusCode = HTTP_UNAUTHORIZED_STATUS;

    return next(err);
  }

  try {
    const decoded = jwt.verify(token, 'segredo');

    req.user = decoded;

    return next();
  } catch (err) {
    err.statusCode = HTTP_UNAUTHORIZED_STATUS;

    return next(err);
  }
};

module.exports = auth;

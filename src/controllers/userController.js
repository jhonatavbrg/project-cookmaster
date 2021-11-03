const { user } = require('../services');

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const HTTP_BAD_REQUEST_STATUS = 400;
const HTTP_UNAUTHORIZED_STATUS = 401;

const ENTRIES_ERROR = 'Invalid entries. Try again.';
const LOGIN_FIELD_ERROR = 'All fields must be filled';

const addUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const err = new Error(ENTRIES_ERROR);

    err.statusCode = HTTP_BAD_REQUEST_STATUS;

    return next(err);
  }

  const newUser = await user.addUser({ name, email, password });

  if (newUser.statusCode) return next(newUser);

  res.status(HTTP_CREATED_STATUS).json(newUser);
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error(LOGIN_FIELD_ERROR);

    err.statusCode = HTTP_UNAUTHORIZED_STATUS;

    return next(err);
  }

  const token = await user.login({ email, password });

  if (token.statusCode) return next(token);

  res.status(HTTP_OK_STATUS).json(token);
};

const addAdmin = async (req, res, next) => {
  const { name, email, password } = req.body;
  const { userId, role } = req.user;

  if (!name || !email || !password) {
    const err = new Error(ENTRIES_ERROR);

    err.statusCode = HTTP_BAD_REQUEST_STATUS;

    return next(err);
  }

  const newAdmin = await user.addAdmin({ name, email, password }, { userId, role });

  if (newAdmin.statusCode) return next(newAdmin);

  res.status(HTTP_CREATED_STATUS).json(newAdmin);
};

module.exports = {
  addUser,
  login,
  addAdmin,
};

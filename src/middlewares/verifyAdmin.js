const { forbiddenMsg } = require('../utils/messages');

const verifyAdmin = async (request, response, next) => {
  const { user } = request;
  try {
    if (!user.role || user.role !== 'admin') throw forbiddenMsg;

    request.body.role = user.role;
    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = verifyAdmin;

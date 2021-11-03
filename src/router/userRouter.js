const express = require('express');

const middlewares = require('../middlewares');
const { user } = require('../controllers');

const router = express.Router();

router.post('/', user.addUser);

router.post('/admin', middlewares.auth, user.addAdmin);

module.exports = router;

const express = require('express');

const { user } = require('../controllers');

const router = express.Router();

router.post('/', user.login);

module.exports = router;

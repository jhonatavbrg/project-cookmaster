const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { createUser } = require('../controllers/usersController');
const verifyAdmin = require('../middlewares/verifyAdmin');

const router = express.Router();

router.post('/', createUser);
router.post('/admin', verifyToken, verifyAdmin, createUser);

module.exports = router;

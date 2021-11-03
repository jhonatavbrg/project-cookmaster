const express = require('express');
const user = require('./userRouter');
const recipe = require('./recipesRouter');
const login = require('./loginRouter');

const router = express.Router();

router.use('/users', user);
router.use('/recipes', recipe);
router.use('/login', login);

module.exports = router;

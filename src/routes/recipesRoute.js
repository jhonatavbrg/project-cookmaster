const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { createRecipe, getAllRecipes,
  getRecipeById, editRecipe, deleteRecipe } = require('../controllers/recipesController');
const { uploadImg } = require('../controllers/uploadsController');

const router = express.Router();

router.post('/', verifyToken, createRecipe);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', verifyToken, editRecipe);
router.delete('/:id', verifyToken, deleteRecipe);
router.put('/:id/image', verifyToken, uploadImg);

module.exports = router;

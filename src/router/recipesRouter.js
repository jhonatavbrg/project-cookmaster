const express = require('express');
const multer = require('multer');
const path = require('path');

const middlewares = require('../middlewares');
const { recipe } = require('../controllers');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, _file, cb) => cb(null, `${req.params.id}.jpeg`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/jpeg') {
      req.fileExtensionError = true;

      return cb(null, false);
    }

    cb(null, true);
  },
});

router.post('/', middlewares.auth, recipe.addRecipe);
router.get('/', recipe.getRecipes);

router.get('/:id', recipe.getRecipeById);
router.put('/:id', middlewares.auth, recipe.updateRecipe);
router.delete('/:id', middlewares.auth, recipe.deleteRecipe);

router.put('/:id/image', middlewares.auth, upload.single('image'), recipe.addImage);

module.exports = router;

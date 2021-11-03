const path = require('path');

const { recipe } = require('../services');

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const HTTP_NO_CONTENT_STATUS = 204;
const HTTP_BAD_REQUEST_STATUS = 400;
const HTTP_NOT_FOUND_STATUS = 404;

const ENTRIES_ERROR = 'Invalid entries. Try again.';
const RECIPE_NOT_FOUND_ERROR = 'recipe not found';

const badRequest = () => {
  const err = new Error(ENTRIES_ERROR);

  err.statusCode = HTTP_BAD_REQUEST_STATUS;

  return err;
};

const idValidator = (id) => {
  const idRegex = /^.{24}$/;

  const test = idRegex.test(id);

  if (!test) {
    const err = new Error(RECIPE_NOT_FOUND_ERROR);

    err.statusCode = HTTP_NOT_FOUND_STATUS;

    return err;
  }

  return test;
};

const addRecipe = async (req, res, next) => {
  const { name, ingredients, preparation } = req.body;
  const { userId, email, role } = req.user;

  if (!name || !ingredients || !preparation) return next(badRequest());

  const newRecipe = await recipe.addRecipe(
    { name, ingredients, preparation },
    { userId, email, role },
  );

  if (newRecipe.statusCode) return next(newRecipe);

  res.status(HTTP_CREATED_STATUS).json(newRecipe);
};

const getRecipes = async (_req, res, _next) => {
  const recipes = await recipe.getRecipes();

  res.status(HTTP_OK_STATUS).send(recipes);
};

const findRecipe = async (id) => {
  const foundRecipe = await recipe.getRecipeById(id);

  if (!foundRecipe) {
    const err = new Error(RECIPE_NOT_FOUND_ERROR);

    err.statusCode = HTTP_NOT_FOUND_STATUS;

    return err;
  }

  return foundRecipe;
};

const getRecipeById = async (req, res, next) => {
  const { id } = req.params;

  if (idValidator(id).statusCode) return next(idValidator(id));

  const foundRecipe = await findRecipe(id);

  if (foundRecipe.statusCode) return next(foundRecipe);

  res.status(HTTP_OK_STATUS).json(foundRecipe);
};

const updateRecipe = async (req, res, next) => {
  const { id } = req.params;
  const { name, ingredients, preparation } = req.body;
  const { userId, email, role } = req.user;

  if (idValidator(id).statusCode) return next(idValidator(id));

  const foundRecipe = await findRecipe(id);

  if (foundRecipe.statusCode) return next(foundRecipe);

  const updatedRecipe = await recipe.updateRecipe(
    { name, ingredients, preparation },
    { userId, email, role },
    id,
  );

  if (updatedRecipe.statusCode) return next(updatedRecipe);

  res.status(HTTP_OK_STATUS).json(updatedRecipe);
};

const deleteRecipe = async (req, res, next) => {
  const { id } = req.params;
  const { userId, email, role } = req.user;

  if (idValidator(id).statusCode) return next(idValidator(id));

  const foundRecipe = await findRecipe(id);

  if (foundRecipe.statusCode) return next(foundRecipe);

  const deletedRecipe = await recipe.deleteRecipe({ userId, email, role }, id);

  if (deletedRecipe.statusCode) return next(deletedRecipe);

  res.status(HTTP_NO_CONTENT_STATUS).end();
};

const addImage = async (req, res, next) => {
  const { id } = req.params;
  const { userId, email, role } = req.user;

  if (idValidator(id).statusCode) return next(idValidator(id));

  const foundRecipe = await findRecipe(id);

  if (foundRecipe.statusCode) return next(foundRecipe);

  const image = path.join('localhost:3000/src', 'uploads', `${id}.jpeg`);

  const recipeImage = await recipe.addImage({ userId, email, role }, id, image);

  if (recipeImage.statusCode) return next(recipeImage);

  res.status(HTTP_OK_STATUS).json({ ...foundRecipe, image });
};

module.exports = {
  addRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addImage,
};

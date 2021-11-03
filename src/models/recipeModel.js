const { ObjectId } = require('mongodb');
const connection = require('./connection');

const COLLECTION = 'recipes';

const addRecipe = async (recipeData) => {
  const recipeCollection = await connection().then((db) => db.collection(COLLECTION));

  const { insertedId: _id } = await recipeCollection.insertOne({ ...recipeData });

  return { recipe: { _id, ...recipeData } };
};

const getRecipes = async () => {
  const recipeCollection = await connection().then((db) => db.collection(COLLECTION));

  return recipeCollection.find().toArray();
};

const getRecipeById = async (id) => {
  const recipeCollection = await connection().then((db) => db.collection(COLLECTION));

  return recipeCollection.findOne({ _id: ObjectId(id) });
};

const updateRecipe = async (recipeData, id) => {
  const recipeCollection = await connection().then((db) => db.collection(COLLECTION));

  return recipeCollection.updateOne({ _id: ObjectId(id) }, { $set: { ...recipeData } });
};

const deleteRecipe = async (id) => {
  const recipeCollection = await connection().then((db) => db.collection(COLLECTION));

  return recipeCollection.deleteOne({ _id: ObjectId(id) });
};

const addImage = async (id, image) => {
  const recipeCollection = await connection().then((db) => db.collection(COLLECTION));

  return recipeCollection.updateOne({ _id: ObjectId(id) }, { $set: { image } });
};

module.exports = {
  addRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addImage,
};

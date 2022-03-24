const userObj = {
  name: 'Chad Silva',
  email: 'chad@teste.com',
  password: 'secret123',
};

const adminObj = {
  name: 'chad admin',
  email: 'chadAdmin@teste.com',
  password: 'secret123',
  role: 'admin',
};

const emailError = {
  email: 'chad@teste.com',
  password: 'secret123',
};

const passwordError = {
  email: 'chad@teste.com',
  password: 'secret123',
};

const correctLogin = {
  email: 'chad@teste.com',
  password: 'secret123',
};

const correctLoginAdmin = {
  email: 'chadAdmin@teste.com',
  password: 'secret123',
};

const recipeObj = {
  name: 'Torta de Manteiga Escocesa',
  ingredients: 'Farinha, Acucar, Chocolate, Ovo, Manteiga',
  preparation: '15 min no forno, pre-aquecido',
};

const recipeObjModify = {
  name: 'Bolo de morango',
  ingredients: 'Farinha, Acucar, Morango, Ovo, Manteiga',
  preparation: '10 min no forno, pre-aquecido',
};

module.exports = {
  userObj,
  adminObj,
  emailError,
  passwordError,
  correctLogin,
  correctLoginAdmin,
  recipeObj,
  recipeObjModify,
};

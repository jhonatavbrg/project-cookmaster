const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const usersRoutes = require('../routes/usersRoute');
const loginRoute = require('../routes/loginRoute');
const recipesRoutes = require('../routes/recipesRoute');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.send();
});

app.use('/users', usersRoutes);
app.use('/login', loginRoute);
app.use('/recipes', recipesRoutes);

app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

app.use((err, _req, res, _next) => {
  if (err.status) return res.status(err.status).json({ message: err.message });
  return res.status(500).json({ message: err.message });
});

module.exports = app;

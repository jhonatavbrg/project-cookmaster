const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');
const getConnection = require('./connectionMock');
const { MongoClient } = require('mongodb');
const { expect } = chai;

const DB_NAME = 'Cookmaster';
const COLLECTION_USER = 'users';
const COLLECTION_RECIPE = 'recipes';

const server = require('../api/app');
const Model = require('../models');

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const HTTP_NO_CONTENT_STATUS = 204;
const HTTP_BAD_REQUEST_STATUS = 400;
const HTTP_UNAUTHORIZED_STATUS = 401;
const HTTP_FORBIDDEN_STATUS = 403;
const HTTP_NOT_FOUND_STATUS = 404;
const HTTP_CONFLICT_STATUS = 409;

const ENTRIES_ERROR = 'Invalid entries. Try again.';
const EMAIL_CONFLICT_ERROR = 'Email already registered';
const LOGIN_FIELD_ERROR = 'All fields must be filled';
const LOGIN_INCORRECT_ERROR = 'Incorrect username or password';
const RECIPE_NOT_FOUND_ERROR = 'recipe not found';
const TOKEN_ERROR = 'missing auth token';
const NOT_YOUR_RECIPE_ERROR = 'You can only modify your own recipes';
const ADMIN_ERROR = 'Only admins can register new admins';

const ID_EXAMPLE = '604cb554311d68f491ba5781';

chai.use(chaiHttp);

describe('POST /users', () => {
  describe('quando não é passado o campo "name"', () => {
    const payload = { password: 'tester123', email: 'testythetester@gmail.com' };
    let response;

    before(async () => {
      response = await chai.request(server).post('/users').send(payload);
    });

    it('retorna status 400', () => {
      expect(response).to.have.status(HTTP_BAD_REQUEST_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(ENTRIES_ERROR);
    });
  });
  
  describe('quando não é passado o campo "password"', () => {
    const payload = { name: 'Testy', email: 'testythetester@gmail.com' };
    let response;

    before(async () => {
      response = await chai.request(server).post('/users').send(payload);
    });

    it('retorna status 400', () => {
      expect(response).to.have.status(HTTP_BAD_REQUEST_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(ENTRIES_ERROR);
    });
  });

  describe('quando não é passado o campo "email"', () => {
    const payload = { name: 'Testy', password: 'tester123' };
    let response;

    before(async () => {
      response = await chai.request(server).post('/users').send(payload);
    });

    it('retorna status 400', () => {
      expect(response).to.have.status(HTTP_BAD_REQUEST_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(ENTRIES_ERROR);
    });
  });

  describe('quando o "email" passado não é valido', () => {
    const payload = { name: 'Testy', password: 'tester123', email: 'testysmail' };
    let response;

    before(async () => {
      response = await chai.request(server).post('/users').send(payload);
    });

    it('retorna status 400', () => {
      expect(response).to.have.status(HTTP_BAD_REQUEST_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(ENTRIES_ERROR);
    });
  });

  describe('quando o "email" passado já existe no cadastro', () => {
    const payload = { name: 'Testy', password: 'tester123', email: 'testythetester@gmail.com' };
    let response;

    before(async () => {
      sinon.stub(Model.user, 'findByEmail').resolves(true);

      response = await chai.request(server).post('/users').send(payload);
    });

    after(() => {
      Model.user.findByEmail.restore();
    });

    it('retorna status 409', () => {
      expect(response).to.have.status(HTTP_CONFLICT_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(EMAIL_CONFLICT_ERROR);
    });
  });

  describe('com dados válidos', () => {
    const payload = { name: 'Testy', password: 'tester123', email: 'testythetester@gmail.com' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      response = await chai.request(server).post('/users').send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 201', () => {
      expect(response).to.have.status(HTTP_CREATED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "user"', () => {
      expect(response.body).to.have.property('user');
    });

    it('objeto de resposta possui a proprieadade "role"', () => {
      expect(response.body.user).to.have.property('role');
    });

    it('com o perfil correto', () => {
      expect(response.body.user.role).to.be.equal('user');
    });
  });
});

describe('POST /login', () => {
  describe('quando não é passado o campo "password"', () => {
    const payload = { email: 'testythetester@gmail.com' };
    let response;

    before(async () => {
      response = await chai.request(server).post('/login').send(payload);
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(LOGIN_FIELD_ERROR);
    });
  });

  describe('quando não é passado o campo "email"', () => {
    const payload = { password: 'tester123' };
    let response;

    before(async () => {
      response = await chai.request(server).post('/login').send(payload);
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(LOGIN_FIELD_ERROR);
    });
  });

  describe('quando o "email" passado não é valido', () => {
    const payload = { password: 'tester123', email: 'testysmail' };
    let response;

    before(async () => {
      response = await chai.request(server).post('/login').send(payload);
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(LOGIN_INCORRECT_ERROR);
    });
  });

  describe('quando a senha passada não é a correta', () => {
    const payload = { password: 'incorrect', email: 'testythetester@gmail.com' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      response = await chai.request(server).post('/login').send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(LOGIN_INCORRECT_ERROR);
    });
  });

  describe('com dados válidos', () => {
    const payload = { password: 'tester123', email: 'testythetester@gmail.com' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(payload);

      response = await chai.request(server).post('/login').send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 200', () => {
      expect(response).to.have.status(HTTP_OK_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('que possui a propriedade "token"', () => {
      expect(response.body).to.have.property('token');
    });
  });
});

describe('POST /recipes', () => {
  const user = { name: 'Testy', password: 'tester123', email: 'testythetester@gmail.com', role: 'user' };

  describe('quando não é passado um token jwt', () => {
    const payload = { name: 'chocolate milk', ingredients: 'chocolate, milk', preparation: 'mix and drink' };
    let response;

    before(async () => {
      response = await chai.request(server).post('/recipes').send(payload);
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });
  });

  describe('quando não é passado o campo "name"', () => {
    const payload = { ingredients: 'chocolate, milk', preparation: 'mix and drink' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      const token = await chai.request(server).post('/login').send(user).then((res) => res.body.token);

      response = await chai.request(server).post('/recipes').set('authorization', token).send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 400', () => {
      expect(response).to.have.status(HTTP_BAD_REQUEST_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(ENTRIES_ERROR);
    });
  });

  describe('quando não é passado o campo "ingredients"', () => {
    const payload = { name: 'chocolate milk', preparation: 'mix and drink' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      const token = await chai.request(server).post('/login').send(user).then((res) => res.body.token);

      response = await chai.request(server).post('/recipes').set('authorization', token).send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 400', () => {
      expect(response).to.have.status(HTTP_BAD_REQUEST_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(ENTRIES_ERROR);
    });
  });

  describe('quando não é passado o campo "preparation"', () => {
    const payload = { name: 'chocolate milk', ingredients: 'chocolate, milk' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      const token = await chai.request(server).post('/login').send(user).then((res) => res.body.token);

      response = await chai.request(server).post('/recipes').set('authorization', token).send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 400', () => {
      expect(response).to.have.status(HTTP_BAD_REQUEST_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(ENTRIES_ERROR);
    });
  });

  describe('com dados válidos', () => {
    const payload = { name: 'chocolate milk', ingredients: 'chocolate, milk', preparation: 'mix and drink' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      const token = await chai.request(server).post('/login').send(user).then((res) => res.body.token);

      response = await chai.request(server).post('/recipes').set('authorization', token).send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 201', () => {
      expect(response).to.have.status(HTTP_CREATED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('que possui a propriedade "recipe"', () => {
      expect(response.body).to.have.property('recipe');
    });
  });
});

describe('GET /recipes', () => {
  describe('em todos os casos', () => {
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      response = await chai.request(server).get('/recipes');
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna um array no body', () => {
      expect(response.body).to.be.an('array');
    });
  });
});

describe('GET /recipes/:id', () => {
  describe('quando não encontrada', () => {
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      response = await chai.request(server).get(`/recipes/${ID_EXAMPLE}`);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 404', () => {
      expect(response).to.have.status(HTTP_NOT_FOUND_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(RECIPE_NOT_FOUND_ERROR);
    });
  });

  describe('quando encontrada', () => {
    const payload = { name: 'chocolate milk', ingredients: 'chocolate, milk', preparation: 'mix and drink' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      const { insertedId } = await connectionMock.db(DB_NAME).collection(COLLECTION_RECIPE).insertOne(payload);

      response = await chai.request(server).get(`/recipes/${insertedId}`);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 200', () => {
      expect(response).to.have.status(HTTP_OK_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('que possui a propriedade "ingredients"', () => {
      expect(response.body).to.have.property('ingredients');
    });
  });
});

describe('PUT /recipes/:id', () => {
  const user = { name: 'Testy', password: 'tester123', email: 'testythetester@gmail.com', role: 'user' };
  const user2 = { name: 'Testy2', password: 'tester1234', email: 'testy2@gmail.com', role: 'user' };

  describe('quando não é passado um token jwt', () => {
    const payload = { name: 'chocolate milk', ingredients: 'chocolate, milk', preparation: 'mix and drink' };
    let response;

    before(async () => {
      response = await chai.request(server).put(`/recipes/${ID_EXAMPLE}`).send(payload);
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(TOKEN_ERROR);
    });
  });

  describe('quando não encontrada', () => {
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      const token = await chai.request(server).post('/login').send(user).then((res) => res.body.token);

      response = await chai.request(server).put(`/recipes/${ID_EXAMPLE}`).set('authorization', token);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 404', () => {
      expect(response).to.have.status(HTTP_NOT_FOUND_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(RECIPE_NOT_FOUND_ERROR);
    });
  });

  describe('quando a receita não foi feita pelo usuário', () => {
    const payload = { name: 'chocolate milk', ingredients: 'chocolate, milk', preparation: 'mix and drink' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      const { insertedId: userId } = await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user2);

      const token = await chai.request(server).post('/login').send(user2).then((res) => res.body.token);

      const { insertedId } = await connectionMock.db(DB_NAME).collection(COLLECTION_RECIPE).insertOne({ ...payload, userId });

      response = await chai.request(server).put(`/recipes/${insertedId}`).set('authorization', token).send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(NOT_YOUR_RECIPE_ERROR);
    });
  });

  describe('com tudo válido', () => {
    const payload = { name: 'chocolate milk', ingredients: 'chocolate, milk', preparation: 'mix and drink' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      const { insertedId: userId } = await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      const token = await chai.request(server).post('/login').send(user).then((res) => res.body.token);

      const { insertedId } = await connectionMock.db(DB_NAME).collection(COLLECTION_RECIPE).insertOne({ ...payload, userId });

      response = await chai.request(server).put(`/recipes/${insertedId}`).set('authorization', token).send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 200', () => {
      expect(response).to.have.status(HTTP_OK_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "ingredients"', () => {
      expect(response.body).to.have.property('ingredients');
    });
  });
});

describe('DELETE /recipes/:id', () => {
  const user = { name: 'Testy', password: 'tester123', email: 'testythetester@gmail.com', role: 'user' };
  const user2 = { name: 'Testy2', password: 'tester1234', email: 'testy2@gmail.com', role: 'user' };

  describe('quando não é passado um token jwt', () => {
    let response;

    before(async () => {
      response = await chai.request(server).delete(`/recipes/${ID_EXAMPLE}`);
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(TOKEN_ERROR);
    });
  });

  describe('quando não encontrada', () => {
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      const token = await chai.request(server).post('/login').send(user).then((res) => res.body.token);

      response = await chai.request(server).delete(`/recipes/${ID_EXAMPLE}`).set('authorization', token);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 404', () => {
      expect(response).to.have.status(HTTP_NOT_FOUND_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(RECIPE_NOT_FOUND_ERROR);
    });
  });

  describe('quando a receita não foi feita pelo usuário', () => {
    const payload = { name: 'chocolate milk', ingredients: 'chocolate, milk', preparation: 'mix and drink' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      const { insertedId: userId } = await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user2);

      const token = await chai.request(server).post('/login').send(user2).then((res) => res.body.token);

      const { insertedId } = await connectionMock.db(DB_NAME).collection(COLLECTION_RECIPE).insertOne({ ...payload, userId });

      response = await chai.request(server).delete(`/recipes/${insertedId}`).set('authorization', token).send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(NOT_YOUR_RECIPE_ERROR);
    });
  });

  describe('com tudo válido', () => {
    const payload = { name: 'chocolate milk', ingredients: 'chocolate, milk', preparation: 'mix and drink' };
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      const { insertedId: userId } = await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      const token = await chai.request(server).post('/login').send(user).then((res) => res.body.token);

      const { insertedId } = await connectionMock.db(DB_NAME).collection(COLLECTION_RECIPE).insertOne({ ...payload, userId });

      response = await chai.request(server).delete(`/recipes/${insertedId}`).set('authorization', token).send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 204', () => {
      expect(response).to.have.status(HTTP_NO_CONTENT_STATUS);
    });
  });
});

describe('PUT /recipes/:id/image', () => {
  const user = { name: 'Testy', password: 'tester123', email: 'testythetester@gmail.com', role: 'user' };
  const user2 = { name: 'Testy2', password: 'tester1234', email: 'testy2@gmail.com', role: 'user' };
  const payload = { name: 'chocolate milk', ingredients: 'chocolate, milk', preparation: 'mix and drink' };

  describe('quando não é passado um token jwt', () => {
    let response;

    before(async () => {
      response = await chai.request(server).put(`/recipes/${ID_EXAMPLE}/image`);
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(TOKEN_ERROR);
    });
  });

  describe('quando não encontrada', () => {
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      const token = await chai.request(server).post('/login').send(user).then((res) => res.body.token);

      response = await chai.request(server).put(`/recipes/${ID_EXAMPLE}/image`).set('authorization', token);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 404', () => {
      expect(response).to.have.status(HTTP_NOT_FOUND_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(RECIPE_NOT_FOUND_ERROR);
    });
  });

  describe('quando a receita não foi feita pelo usuário', () => {
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      const { insertedId: userId } = await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user2);

      const token = await chai.request(server).post('/login').send(user2).then((res) => res.body.token);

      const { insertedId } = await connectionMock.db(DB_NAME).collection(COLLECTION_RECIPE).insertOne({ ...payload, userId });

      response = await chai.request(server).put(`/recipes/${insertedId}/image`).set('authorization', token);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(NOT_YOUR_RECIPE_ERROR);
    });
  });

  describe('com tudo válido', () => {
    let response;

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      const { insertedId: userId } = await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      const token = await chai.request(server).post('/login').send(user).then((res) => res.body.token);

      const { insertedId } = await connectionMock.db(DB_NAME).collection(COLLECTION_RECIPE).insertOne({ ...payload, userId });

      response = await chai.request(server).put(`/recipes/${insertedId}/image`).set('authorization', token).attach('image', fs.readFileSync(path.join(__dirname, '..', 'uploads', 'ratinho.jpg')));
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 200', () => {
      expect(response).to.have.status(HTTP_OK_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "image"', () => {
      expect(response.body).to.have.property('image');
    });
  });
});

describe('POST /users/admin', () => {
  const user = { name: 'Testy', password: 'tester123', email: 'testythetester@gmail.com', role: 'user' };
  const admin = { name: 'Admin', password: 'admin1234', email: 'admin@gmail.com', role: 'admin' };

  describe('quando não é passado um token jwt', () => {
    let response;

    before(async () => {
      response = await chai.request(server).post('/users/admin');
    });

    it('retorna status 401', () => {
      expect(response).to.have.status(HTTP_UNAUTHORIZED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(TOKEN_ERROR);
    });
  });

  describe('sem estar logado como admin', () => {
    let response;
    const payload = { name: 'Adm Testy', password: 'admtesty123', email: 'testytheadmin@gmail.com' };

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(user);

      const token = await chai.request(server).post('/login').send(user).then((res) => res.body.token);
      
      response = await chai.request(server).post('/users/admin').set('authorization', token).send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 403', () => {
      expect(response).to.have.status(HTTP_FORBIDDEN_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it('com a mensagem correta', () => {
      expect(response.body.message).to.be.equal(ADMIN_ERROR);
    });
  });

  describe('com tudo válido', () => {
    let response;
    const payload = { name: 'Adm Testy', password: 'admtesty123', email: 'testytheadmin@gmail.com' };

    before(async () => {
      const connectionMock = await getConnection();

      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await connectionMock.db(DB_NAME).collection(COLLECTION_USER).insertOne(admin);

      const token = await chai.request(server).post('/login').send(admin).then((res) => res.body.token);
      
      response = await chai.request(server).post('/users/admin').set('authorization', token).send(payload);
    });

    after(() => {
      MongoClient.connect.restore();
    });

    it('retorna status 201', () => {
      expect(response).to.have.status(HTTP_CREATED_STATUS);
    });

    it('retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('objeto de resposta possui a propriedade "user"', () => {
      expect(response.body).to.have.property('user');
    });

    it('objeto de resposta possui a proprieadade "role"', () => {
      expect(response.body.user).to.have.property('role');
    });

    it('com o perfil correto', () => {
      expect(response.body.user.role).to.be.equal('admin');
    });
  });
});

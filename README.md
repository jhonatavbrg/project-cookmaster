# Habilidades

Neste projeto, você será capaz de:

- Entender o que há por dentro de um token de autenticação;

- Gerar tokens a partir de informações como login e senha;

- Autenticar rotas do Express, usando o token JWT;

- Fazer upload de arquivos em APIs REST;

- Salvar arquivos no servidor através de uma API REST;

- Consultar arquivos do servidor através de uma api REST.

- Realizar testes de integração

---

# Requisitos do projeto

## Requisitos Obrigatórios

### 1 - Crie um endpoint para o cadastro de usuários

- A rota deve ser (`/users`).

- No banco um usuário precisa ter os campos Email, Senha, Nome e Role.

- Para criar um usuário através da API, todos os campos são obrigatórios, com exceção do Role.

- O campo Email deve ser único.

- Usuários criados através desse endpoint devem ter seu campo Role com o atributo _user_, ou seja, devem ser usuários comuns, e não admins.

- O body da requisição deve conter o seguinte formato:

  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- Não use `bcrypt` ou outra biblioteca para encriptar a senha, para que o avaliador funcione corretamente.

### 2 - Crie um endpoint para o login de usuários

- A rota deve ser (`/login`).

- A rota deve receber os campos Email e Senha e esses campos devem ser validados no banco de dados.

- Na configuração do `JWT` **não use variáveis de ambientes** para não ter conflito com o avaliador.

- Um token `JWT` deve ser gerado e retornado caso haja sucesso no login. No seu payload deve estar presente o id, email e role do usuário.

- O body da requisição deve conter o seguinte formato:

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### 3 - Crie um endpoint para o cadastro de receitas

- A rota deve ser (`/recipes`).

- A receita só pode ser criada caso o usuário esteja logado e o token `JWT` validado.

- No banco, a receita deve ter os campos Nome, Ingredientes, Modo de preparo, URL da imagem e Id do Autor.

- Nome, ingredientes e modo de preparo devem ser recebidos no corpo da requisição, com o seguinte formato:

  ```json
  {
    "name": "string",
    "ingredients": "string",
    "preparation": "string"
  }
  ```

- O campo dos ingredientes pode ser um campo de texto aberto.

- O campo ID do autor, deve ser preenchido automaticamente com o ID do usuário logado, que deve ser extraído do token JWT.

- A URL da imagem será preenchida através de outro endpoint

### 4 - Crie um endpoint para a listagem de receitas

- A rota deve ser (`/recipes`).

- A rota pode ser acessada por usuários logados ou não

### 5 - Crie um endpoint para visualizar uma receita específica

- A rota deve ser (`/recipes/:id`).

- A rota pode ser acessada por usuários logados ou não

### 6 - Crie uma query em mongo que insira uma pessoa usuária com permissões de admin

Crie um arquivo `seed.js` na raiz do projeto com uma query do Mongo DB capaz de inserir um usuário na coleção _users_ com os seguintes valores:

`{ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' }`

**Obs.:** Esse usuário tem o poder de criar, deletar, atualizar ou remover qualquer receita, independente de quem a cadastrou. Isso será solicitado ao longo dos próximos requisitos.

### 7 - Crie um endpoint para a edição de uma receita

- A rota deve ser (`/recipes/:id`).

- A receita só pode ser atualizada caso o usuário esteja logado e o token `JWT` validado.

- A receita só pode ser atualizada caso pertença ao usuário logado, ou caso esse usuário seja um admin.

- O corpo da requisição deve receber o seguinte formato:

  ```json
  {
    "name": "string",
    "ingredients": "string",
    "preparation": "string"
  }
  ```

### 8 - Crie um endpoint para a exclusão de uma receita

- A rota deve ser (`/recipes/:id`).

- A receita só pode ser excluída caso o usuário esteja logado e o token `JWT` validado.

- A receita só pode ser excluída caso pertença ao usuário logado, ou caso o usuário logado seja um admin.

### 9 - Crie um endpoint para a adição de uma imagem a uma receita

- A rota deve ser (`/recipes/:id/image/`).

- A imagem deve ser lida do campo `image`.

- O endpoint deve aceitar requisições no formato `multipart/form-data`.

- A receita só pode ser atualizada caso o usuário esteja logado e o token `JWT` validado.

- A receita só pode ser atualizada caso pertença ao usuário logado ou caso o usuário logado seja admin.

- O upload da imagem deverá ser feito utilizando o `Multer`.

- O nome do arquivo deve ser o ID da receita, e sua extensão `.jpeg`.

- A URL completa para acessar a imagem através da API deve ser gravada no banco de dados, junto com os dados da receita.

### 10 - Crie um endpoint para acessar a imagem de uma receita

- As imagens devem estar disponíveis através da rota `/images/<id-da-receita>.jpeg` na API.

### 11 - Crie testes de integração que cubram no mínimo 30% dos arquivos em `src`, com um mínimo de 50 linhas cobertas

- Os testes de integração devem ser criados na pasta `./src/integration-tests`, essa pasta **não pode ser renomeada ou removida**;

- O arquivo `change.me.test.js` pode ser alterado, renomeado ou removido;

- Os testes devem ser criados usando o instrumental e boas práticas apresentado nos conteúdos de testes do course;

- Para rodar os testes, utilize o comando `npm run dev:test`;

- Para visualizar a cobertura, utilize o comando `npm run dev:test:coverage`;

## Requisitos Bônus

### 12 - Crie um endpoint para cadastro de pessoas administradoras

- A rota deve ser (`/users/admin`).

- Só será possível adicionar um admin caso esta ação esteja sendo feita por outro admin, portanto, deve ser validado se há um admin logado.

- Por padrão, as requisições pra esse endpoint devem adicionar um usuário com a role _admin_.

- O corpo da requisição deve ter o seguinte formato:

  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

### 13 - Crie testes de integração que cubram no mínimo 60% dos arquivos em `src`, com um mínimo de 100 linhas cobertas

- Os testes de integração devem ser criados na pasta `./src/integration-tests`, essa pasta **não pode ser renomeada ou removida**;

- O arquivo `change.me.test.js` pode ser alterado, renomeado ou removido;

- Os testes devem ser criados usando o instrumental e boas práticas apresentado nos conteúdos de testes do course;

- Para rodar os testes, utilize o comando `npm run dev:test`;

- Para visualizar a cobertura, utilize o comando `npm run dev:test:coverage`;

### 14 - Crie testes de integração que cubram no mínimo 90% dos arquivos em `src`, com um mínimo de 150 linhas cobertas

- Os testes de integração devem ser criados na pasta `./src/integration-tests`, essa pasta **não pode ser renomeada ou removida**;

- O arquivo `change.me.test.js` pode ser alterado, renomeado ou removido;

- Os testes devem ser criados usando o instrumental e boas práticas apresentado nos conteúdos de testes do course;

- Para rodar os testes, utilize o comando `npm run dev:test`;

- Para visualizar a cobertura, utilize o comando `npm run dev:test:coverage`;

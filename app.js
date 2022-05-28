
require('dotenv').config({path: __dirname + '/.env'})

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { resolver } = require('graphql-sequelize');
const schema = require('./schema');

const app = express();

app.use('/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true,
  }),
);

app.listen(process.env.APP_PORT);

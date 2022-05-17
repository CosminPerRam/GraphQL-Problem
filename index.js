const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
    query {
        hello: String
    }
`);

const root = { hello: () => 'Hello world!' };

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);

app.listen(4000);
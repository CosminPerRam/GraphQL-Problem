const express = require('express');
const { graphql, buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const { Sequelize } = require('sequelize');
const credentials = require('./credentials.json');

var sequelize = new Sequelize(credentials.db_name, credentials.username, credentials.password, {
    host: credentials.host,
    dialect: 'mariadb'
})

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

const schema = buildSchema(`
    type Query {
        persons: [Person]
        jobs: [Job]
    }

    type Person {
        name: String
    }

    type Job {
        description: String
        employee: Employee
        employer: String
    }

    type Employee {
        name: String
    }
`);

const allPersons = [
    {
        name: "someone"
    },
    {
        name: "anotherone"
    }
]
const allJobs = [
    {
        description: "Banana collector",
        employee: {
            name: "Cosmin"
        },
        employer: "Bezos"
    },
    {
        description: "Discord admin",
        employee: {
            name: "Lucian"
        },
        employer: "Reddit moderator"
    }
]

const graphRoot = {
    persons: () => (allPersons),
    jobs: () => (allJobs)
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: graphRoot,
    graphiql: true,
  }),
);

app.listen(4000);

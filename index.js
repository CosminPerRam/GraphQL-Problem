const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const { graphql, buildSchema } = require('graphql');

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

var allPersons = [
    {
        name: "someone"
    },
    {
        name: "anotherone"
    }
]

var allJobs = [
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

const root = {
    persons: () => (allPersons),
    jobs: () => (allJobs)
};

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
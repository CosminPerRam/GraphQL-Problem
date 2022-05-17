const express = require('express');
const { graphql, buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

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
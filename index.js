const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { Sequelize } = require('sequelize');
const { resolver } = require('graphql-sequelize');
const credentials = require('./credentials.json');
const {GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLInputObjectType, GraphQLString, GraphQLSchema, GraphQLNonNull} = require('graphql');

var sequelize = new Sequelize(credentials.db_name, credentials.username, credentials.password, {
    host: credentials.host,
    dialect: 'mariadb'
})

//define our models
let Person = sequelize.define('person', {
    name: Sequelize.STRING
});

let Employee = sequelize.define('employee', {
    name: Sequelize.STRING,
});

let Job = sequelize.define('job', {
    description: Sequelize.STRING,
    employer: Sequelize.STRING
});

Job.Employee = Job.hasOne(Employee, {as:"employee"});

sequelize.sync({alter: true}) //sync the db, `alter:true` is for reapplying the required specifications
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });

//our graphql objects
let personType = new GraphQLObjectType({
    name: `Person`,
    description: 'A Person',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The id of the person.'
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The name of the person.'
        }
    }
});

let employeeType = new GraphQLObjectType({
    name: `Employee`,
    description: 'An Employee',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The id of the employee.'
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The name of the employee.'
        }
    }
});

let employeeInput = new GraphQLInputObjectType({
    name: `EmployeeInput`,
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The name of the employee.'
        }
    }
});

let jobType = new GraphQLObjectType({
    name: `Job`,
    description: 'A Job',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The id of the job.'
        },
        employer: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The name of the employer.'
        },
        description: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The description.'
        },
        employee: {
            type: new GraphQLNonNull(employeeType),
            description: 'The employee.',
            resolve: resolver(Job.Employee)
        }
    }
});

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'querys',
      fields: {
        jobs: {
            type: new GraphQLList(jobType),
            resolve: resolver(Job)
        },
        persons: {
            type: new GraphQLList(personType),
            resolve: resolver(Person)
        }
      }
    }),
    mutation: new GraphQLObjectType({
        name: 'mutations',
        fields: {
            createJob: {
                type: jobType,
                args: {
                    employer: { type: new GraphQLNonNull(GraphQLString) },
                    description: { type: new GraphQLNonNull(GraphQLString) },
                    employee: { type: new GraphQLNonNull(employeeInput) }
                },
                resolve: (_, args) => {
                    return Job.create({
                        description: args.description,
                        employer: args.employer,
                        employee: args.employee
                    }, {
                        include: [{
                            association: Job.Employee
                        }]
                    });
                }
            },
            createPerson: {
                type: personType,
                args: {
                    name: { type: new GraphQLNonNull(GraphQLString) }
                },
                resolve: (_, args) => {
                    return Person.create(args);
                }
            }
        }
    })
  });

const app = express();

app.use('/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true,
  }),
);

app.listen(4000);

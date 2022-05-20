
const { resolver } = require('graphql-sequelize');
const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLInputObjectType, GraphQLString, GraphQLSchema, GraphQLNonNull } = require('graphql');
const { Person, Employee, Job } = require('./db');

//define our graphql objects and schema...
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

module.exports = new GraphQLSchema({
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


const { Sequelize } = require('sequelize');
const credentials = require('./credentials.json');

var sequelize = new Sequelize(credentials.db_name, credentials.username, credentials.password, {
    host: credentials.host,
    dialect: credentials.dialect
})

//sync the db, `alter:true` is for reapplying the required specifications
sequelize.sync({alter: true})
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });

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

module.exports = { Person, Employee, Job };

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Reputation = sequelize.import('models/Reputation');
const RepThresholdSettings = sequelize.import('models/RepThresholdSettings');
const Prefix = sequelize.import('models/Prefix.js');

module.exports = { Reputation, RepThresholdSettings };

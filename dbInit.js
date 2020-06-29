const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Reputation = sequelize.import('models/Reputation.js');
const ReputationThresholdSettings = sequelize.import('models/RepThresholdSettings.js');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    const rep = [
        Reputation.upsert({ rep_id:0, guild_id:0, user_id:0, user_name:"test", rep_given_by: "test", rep_given_by_id: "0", rep_positive: true, description: "test" }),
        ReputationThresholdSettings.upsert({ guild_id:0, trader_threshold: 5, reputable_threshold: 15, trusted_threshold: 25 })
    ];
    await Promise.all(rep);
    console.log('Database synced');
    sequelize.close();
}).catch(console.error);
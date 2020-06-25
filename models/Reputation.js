module.exports = (sequelize, DataTypes) => {
    return sequelize.define('reputation', {
        guild_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        user_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        rep_given_by: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        rep_id: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
    })
};
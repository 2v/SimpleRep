module.exports = (sequelize, DataTypes) => {
    return sequelize.define('reputation', {
        rep_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true
        },
        guild_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rep_given_by: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rep_given_by_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rep_positive: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })
};
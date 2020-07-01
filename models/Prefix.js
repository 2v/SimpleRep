module.exports = (sequelize, DataTypes) => {
    return sequelize.define('prefix', {
        guild_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        prefix: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: false,
    })
};
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('prefix', {
        guild_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        prefix: {
            type: DataTypes.CHAR,
            allowNull: false
        },
    }, {
        timestamps: false,
    })
};
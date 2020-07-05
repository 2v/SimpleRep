module.exports = (sequelize, DataTypes) => {
    return sequelize.define('repcooldowns', {
        guild_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        default_cooldown: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        trader_cooldown: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reputable_cooldown: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        trusted_cooldown: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
    })
};
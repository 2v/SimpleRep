module.exports = (sequelize, DataTypes) => {
    return sequelize.define('repthresholdsettings', {
        guild_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        trader_threshold: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reputable_threshold: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        trusted_threshold: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
    })
};
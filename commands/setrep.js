module.exports = {
    name: 'setrep',
    aliases: ['repset', 'configurerep', 'config'],
    args: true,
    admin: true,
    usage: '<role> <rep_threshold>',
    description: 'Set the required reputation to gain either the trader, reputable, or trusted role. If these are not set, default values will be used.',
    guildOnly: true,
    async execute(message, args) {
        const { RepThresholdSettings } = require('../dbObjects');
        const { Op } = require("sequelize");

        let requested_role = args[0].toLowerCase();

        if (requested_role !== 'trader' && requested_role !== 'reputable' && requested_role !== 'trusted') {
            return message.reply('You did not specify one of three options for roles: \"Trader,\" \"Reputable,\" and \"Trusted.\"');
        }

        const repThreshold = parseInt(args[1]);

        if(!(typeof repThreshold==='number' && (repThreshold%1)===0)) {
            return message.reply('Please specify an integer value for a threshold.');
        }

        if (repThreshold < 0) {
            return message.reply('You cannot use negative numbers for a threshold!');
        }

        if (repThreshold > 10000) {
            return message.reply('You cannot use an integer value greater than 10,000 for a threshold!');
        }

        const setting = await RepThresholdSettings.findOne({ where: { guild_id: message.guild.id } });
        if (setting) {
            if (requested_role === 'trader') {
                await RepThresholdSettings.update({ trader_threshold: repThreshold }, { where: { guild_id: message.guild.id } });
                return message.reply(`Trader updated to a threshold of: ${repThreshold}`);
            } else if (requested_role === 'reputable') {
                await RepThresholdSettings.update({ reputable_threshold: repThreshold }, { where: { guild_id: message.guild.id } });
                return message.reply(`Reputable updated to a threshold of: ${repThreshold}`);
            } else {
                await RepThresholdSettings.update({ trusted_threshold: repThreshold }, { where: { guild_id: message.guild.id } });
                return message.reply(`Trusted updated to a threshold of: ${repThreshold}`);
            }
        }

        const trader_setting = await RepThresholdSettings.findOne({ where: { guild_id: 0 } });
        let default_trader_setting, default_reputable_threshold, default_trusted_threshold;
        if (trader_setting) {

            default_trader_setting = trader_setting.trader_threshold;
            default_reputable_threshold = trader_setting.reputable_threshold;
            default_trusted_threshold = trader_setting.trusted_threshold;
        } else {
            return message.channel.send('Failed to access database');
        }

        if (requested_role === 'trader') {
            await RepThresholdSettings.create({
                guild_id: message.guild.id,
                trader_threshold: repThreshold,
                reputable_threshold: default_reputable_threshold,
                trusted_threshold: default_trusted_threshold,
            })
            return message.reply(`Trader updated to a threshold of: ${repThreshold}`);
        } else if (requested_role === 'reputable') {
            await RepThresholdSettings.create({
                guild_id: message.guild.id,
                trader_threshold: default_trader_setting,
                reputable_threshold: repThreshold,
                trusted_threshold: default_trusted_threshold,
            })
            return message.reply(`Reputable updated to a threshold of: ${repThreshold}`);
        } else {
            await RepThresholdSettings.create({
                guild_id: message.guild.id,
                trader_threshold: default_trader_setting,
                reputable_threshold: default_reputable_threshold,
                trusted_threshold: repThreshold,
            })
            return message.reply(`Trusted updated to a threshold of: ${repThreshold}`);
        }
    },
};
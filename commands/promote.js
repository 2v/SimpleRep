const { RepThresholdSettings } = require('../dbObjects');
const { Reputation } = require('../dbObjects');
const { Op } = require("sequelize");

module.exports = {
    name: 'promote',
    cooldown: 600,
    args: true,
    usage: '<role>',
    description: 'Use this command to level up to a certain role. Note, you can only change roles if you meet the rep requirement of each specific server. You can check this with the \`!repinfo\` command.',
    guildOnly: true,
    async execute(message, args) {
        let requested_role = args[0].toLowerCase();

        if (requested_role !== 'trader' && requested_role !== 'reputable' && requested_role !== 'trusted') {
            message.reply('You did not specify one of three options for roles: \"Trader,\" \"Reputable,\" and \"Trusted.\"');
            return 100;
        }

        const positive_rep_count = await Reputation.count({
            where: {
                [Op.and]: [
                    { guild_id: message.guild.id },
                    { user_id: message.author.id },
                    { rep_positive: true }
                ]
            }
        });

        const negative_rep_count = await Reputation.count({
            where: {
                [Op.and]: [
                    { guild_id: message.guild.id },
                    { user_id: message.author.id },
                    { rep_positive: false }
                ]
            }
        });

        const totalRep = positive_rep_count - negative_rep_count;

        let trader_threshold, reputable_threshold, trusted_threshold;
        const trader_setting = await RepThresholdSettings.findOne({ where: { guild_id: message.guild.id } });

        if (trader_setting) {
            trader_threshold = trader_setting.trader_threshold;
            reputable_threshold = trader_setting.reputable_threshold;
            trusted_threshold = trader_setting.trusted_threshold;
        } else {
            const default_trader_setting = await RepThresholdSettings.findOne({ where: { guild_id: 0 } });
            trader_threshold = default_trader_setting.trader_threshold;
            reputable_threshold = default_trader_setting.reputable_threshold;
            trusted_threshold = default_trader_setting.trusted_threshold;
        }

        if (requested_role === 'trader' && totalRep >= trader_threshold) {
            const role = message.guild.roles.cache.find(role => role.name === 'Trader');
            const member = message.member;
            await member.roles.add(role);
            return message.reply('You have successfully been promoted to role: Trader.');
        }

        if (requested_role === 'reputable' && totalRep >= reputable_threshold) {
            const role = message.guild.roles.cache.find(role => role.name === 'Reputable');
            const member = message.member;
            await member.roles.add(role);
            return message.reply('You have successfully been promoted to role: Reputable.');
        }

        if (requested_role === 'trusted' && totalRep >= trusted_threshold) {
            const role = message.guild.roles.cache.find(role => role.name === 'Trusted');
            const member = message.member;
            await member.roles.add(role);
            return message.reply('You have successfully been promoted to role: Trusted.');
        }

        return message.reply(`You do not have enough rep to level up at this time. Your total rep is: \`${totalRep}\`. Please be sure to check the requirements by typing \`!repinfo\``);
    },
};
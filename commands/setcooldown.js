const { RepCooldowns } = require('../dbObjects');
const { formatSeconds } = require('../util')

module.exports = {
    name: 'setcooldown',
    aliases: ['repset', 'configurerep', 'config'],
    args: true,
    admin: true,
    usage: '<role> <rep_threshold>',
    description: 'Set the required reputation to gain either the trader, reputable, or trusted role. If these are not set, default values will be used.',
    guildOnly: true,
    async execute(message, args) {
        let requested_cooldown = args[0].toLowerCase();

        if (requested_cooldown !== 'default' && requested_cooldown !== 'trader' && requested_cooldown !== 'reputable' && requested_cooldown !== 'trusted') {
            message.reply('You did not specify one of three options for roles: \`Default\`, \`Trader\`, \`Reputable\`, and \`Trusted\`.');
            return 100;
        }

        const roleCooldown = parseInt(args[1]);

        if(!(typeof roleCooldown === 'number' && (roleCooldown%1)===0)) {
            message.reply('Please specify an integer value for a cooldown. (in seconds)');
            return 100;
        }

        if (roleCooldown < 0) {
            message.reply('You cannot use negative numbers for a cooldown!');
            return 100;
        }

        const setting = await RepCooldowns.findOne({ where: { guild_id: message.guild.id } });
        if (setting) {
            if (requested_cooldown === 'default') {
                await RepCooldowns.update({ default_cooldown: roleCooldown }, { where: { guild_id: message.guild.id } });
                message.reply(`Default role updated to a cooldown of: \`${roleCooldown}\` seconds.`);
                return 200;
            } if (requested_cooldown === 'trader') {
                await RepCooldowns.update({ trader_cooldown: roleCooldown }, { where: { guild_id: message.guild.id } });
                message.reply(`Trader role updated to a cooldown of: \`${roleCooldown}\` seconds.`);
                return 200;
            } else if (requested_cooldown === 'reputable') {
                await RepCooldowns.update({ reputable_cooldown: roleCooldown }, { where: { guild_id: message.guild.id } });
                message.reply(`Reputable role updated to a cooldown of: \`${roleCooldown}\` seconds.`);
                return 200;
            } else {
                await RepCooldowns.update({ trusted_cooldown: roleCooldown }, { where: { guild_id: message.guild.id } });
                message.reply(`Trusted role updated to a cooldown of: \`${roleCooldown}\` seconds.`);
                return 200;
            }
        }

        const default_cooldown = await RepCooldowns.findOne({ where: { guild_id: 0 } });
        let default_default_cooldown, default_trader_cooldown, default_reputable_cooldown, default_trusted_cooldown;
        if (default_cooldown) {
            default_default_cooldown = default_cooldown.default_cooldown;
            default_trader_cooldown = default_cooldown.trader_cooldown;
            default_reputable_cooldown = default_cooldown.reputable_cooldown;
            default_trusted_cooldown = default_cooldown.trusted_cooldown;
        } else {
            message.channel.send('Failed to access database');
            return 100;
        }

        if (requested_cooldown === 'default') {
            await RepCooldowns.create({
                guild_id: message.guild.id,
                default_cooldown: roleCooldown,
                trader_cooldown: default_trader_cooldown,
                reputable_cooldown: default_reputable_cooldown,
                trusted_cooldown: default_trusted_cooldown,
            })
            message.reply(`Default role updated to a cooldown of: \`${roleCooldown}\` seconds.`);
            return 200;
        } if (requested_cooldown === 'trader') {
            await RepCooldowns.create({
                guild_id: message.guild.id,
                default_cooldown: default_default_cooldown,
                trader_cooldown: roleCooldown,
                reputable_cooldown: default_reputable_cooldown,
                trusted_cooldown: default_trusted_cooldown,
            })
            message.reply(`Trader role updated to a cooldown of: \`${roleCooldown}\` seconds.`);
            return 200;
        } else if (requested_cooldown === 'reputable') {
            await RepCooldowns.create({
                guild_id: message.guild.id,
                default_cooldown: default_default_cooldown,
                trader_cooldown: default_trader_cooldown,
                reputable_cooldown: roleCooldown,
                trusted_cooldown: default_trusted_cooldown,
            })
            message.reply(`Reputable role updated to a cooldown of: \`${roleCooldown}\` seconds.`);
            return 200;
        } else {
            await RepCooldowns.create({
                guild_id: message.guild.id,
                default_cooldown: default_default_cooldown,
                trader_cooldown: default_trader_cooldown,
                reputable_cooldown: default_reputable_cooldown,
                trusted_cooldown: roleCooldown,
            })
            message.reply(`Trusted role updated to a cooldown of: \`${roleCooldown}\` seconds.`);
            return 200;
        }
    },
};
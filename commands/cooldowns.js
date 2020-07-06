const { RepCooldowns } = require('../dbObjects');
const { formatSeconds } = require('../util')
const Discord = require('discord.js');

module.exports = {
    name: 'cooldowns',
    description: 'Check the role names and cooldowns associated with each of a server.',
    guildOnly: true,
    async execute(message, args) {
        const cooldown_setting = await RepCooldowns.findOne({ where: { guild_id: message.guild.id } });

        if (cooldown_setting) {

            const settings_embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(message.guild.name + '\'s Cooldown Information:')
                .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
                .addFields(
                    {name: 'Default Role', value: formatSeconds(cooldown_setting.default_cooldown) },
                    { name: 'Trader Role', value: formatSeconds(cooldown_setting.trader_cooldown) },
                    { name: 'Reputable Role', value: formatSeconds(cooldown_setting.reputable_cooldown) },
                    { name: 'Trusted Role', value: formatSeconds(cooldown_setting.trusted_cooldown) },
                )

            await message.channel.send(settings_embed);
            return 200;
        }

        const cooldown_setting_default = await RepCooldowns.findOne({ where: { guild_id: 0 } });

        const default_settings_embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(message.guild.name + '\'s Cooldown Information:')
            .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
            .addFields(
                {name: 'Default Role', value: cooldown_setting_default.default_cooldown },
                { name: 'Trader Role', value: cooldown_setting_default.trader_cooldown },
                { name: 'Reputable Role', value: cooldown_setting_default.reputable_cooldown },
                { name: 'Trusted Role', value: cooldown_setting_default.trusted_cooldown },
            )

        await message.channel.send(default_settings_embed);
        return 200;
    }
}
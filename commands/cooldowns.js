const { RepCooldowns } = require('../dbObjects');
const { formatSeconds } = require('../util')
const Discord = require('discord.js');

module.exports = {
    name: 'cooldowns',
    cooldown: 10,
    admin_cooldown: 3,
    description: 'Check the role names and cooldowns associated with each of a server.',
    guildOnly: true,
    async execute(message, args) {
        const cooldown_setting = await RepCooldowns.findOne({ where: { guild_id: message.guild.id } }) || await RepCooldowns.findOne({ where: { guild_id: 0 } });

        if (cooldown_setting) {

            const settings_embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(message.guild.name + '\'s Cooldown Information:')
                .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
                .addFields(
                    {name: 'Default Role', value: `Cooldown: ${formatSeconds(cooldown_setting.default_cooldown) || 'none'}` },
                    { name: 'Trader Role', value: `Cooldown: ${formatSeconds(cooldown_setting.trader_cooldown) || 'none'}` },
                    { name: 'Reputable Role', value: `Cooldown: ${formatSeconds(cooldown_setting.reputable_cooldown) || 'none'}` },
                    { name: 'Trusted Role', value: `Cooldown: ${formatSeconds(cooldown_setting.trusted_cooldown) || 'none'}` },
                )

            await message.channel.send(settings_embed);
            return 200;
        }
    }
}
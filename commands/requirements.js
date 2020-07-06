const { RepThresholdSettings } = require('../dbObjects');
const Discord = require('discord.js');

module.exports = {
    name: 'requirements',
    cooldown: 10,
    admin_cooldown: 3,
    description: 'Check the role names and rep thresholds associated with each of a server.',
    guildOnly: true,
    async execute(message, args) {
        const trader_setting = await RepThresholdSettings.findOne({ where: { guild_id: message.guild.id } }) || await RepThresholdSettings.findOne({ where: { guild_id: 0 } });

        if (trader_setting) {
            const settings_embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(message.guild.name + '\'s Reputation Requirements:')
                .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
                .addFields(
                    { name: 'Trader Role', value: trader_setting.trader_threshold },
                    { name: 'Reputable Role', value: trader_setting.reputable_threshold },
                    { name: 'Trusted Role', value: trader_setting.trusted_threshold },
                )

            await message.channel.send(settings_embed);
            return 200;
        }
    }
}
module.exports = {
    name: 'repinfo',
    description: 'Check the role names and rep thresholds associated with each',
    guildOnly: true,
    async execute(message, args) {
        const { RepThresholdSettings } = require('../dbObjects');
        const { Op } = require("sequelize");
        const Discord = require('discord.js');

        const trader_setting = await RepThresholdSettings.findOne({ where: { guild_id: message.guild.id } });

        if (trader_setting) {
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(message.guild.name + '\'s Reputation Requirements:')
                .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
                .addFields(
                    { name: 'Trader Role', value: trader_setting.trader_threshold },
                    { name: 'Reputable Role', value: trader_setting.reputable_threshold },
                    { name: 'Trusted Role', value: trader_setting.trusted_threshold },
                )

            return message.channel.send(exampleEmbed);
            // default_trader_setting = trader_setting.trader_threshold;
            // default_reputable_threshold = trader_setting.reputable_threshold;
            // default_trusted_threshold = trader_setting.trusted_threshold;
        }

        return message.channel.send('Failed to access database');
    }
}
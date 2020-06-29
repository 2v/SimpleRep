module.exports = {
    name: 'setrep',
    aliases: ['setrep'],
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

        const repThreshold = args[1];

        if(!Number.isInteger(repThreshold)) {
            return message.reply('Please specify an integer value for a threshold.');
        }

        if (repThreshold < 0) {
            return message.reply('You cannot use negative numbers for a threshold!');
        }

        let guild = message.guild;


    },
};
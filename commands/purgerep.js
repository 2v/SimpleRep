const { Reputation } = require('../dbObjects');
const { Op } = require("sequelize");

module.exports = {
    name: 'purgerep',
    aliases: ['removerep', 'remrep'],
    admin: true,
    args: true,
    usage: '<id>',
    description: 'Remove permanently a specific reputation of a user in the guild. Only administrators have access to this command',
    guildOnly: true,
    async execute(message, args) {
        await Reputation.findAll({
            attributes: [
                'rep_id',
                'guild_id',
                'user_name'
            ],
            where: {
                [Op.and]: [
                    { rep_id: args[0]},
                    { guild_id: message.guild.id }
                ]
            }
        }).then(guildData => {
            if (!guildData[0]) {
                return message.reply(`Could not find any rep with id: ${args[0]}`);
            }
            message.channel.send(`Deleting rep given to \`${guildData[0].user_name}\` with ID: \`${guildData[0].rep_id}\`...`);
            Reputation.destroy({
                where: {
                    rep_id: guildData[0].rep_id
                }
            })
                .then(data => {
                    return message.reply('Success!');
                }, reason => {
                    return message.reply('There was a problem querying the reputation database, please try again later.');
                    // rejection
                });
        }, reason => {
            return message.reply('could not find the requested data, please ensure that the specified REP_ID is correct.');
            // rejection
        });
    },
};
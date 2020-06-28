module.exports = {
    name: 'purgerep',
    args: true,
    usage: '<id>',
    description: 'Remove permanently a specific reputation of a user in the guild. Only administrators have access to this command',
    guildOnly: true,
    async execute(message, args) {
        const { Reputation } = require('../dbObjects');
        const { Op } = require("sequelize");

        console.log(args[0]);
        console.log(message.member.permissions.has('ADMINISTRATOR', true));
        if(!message.member.permissions.has('ADMINISTRATOR', true)) {
            return message.reply('Could not remove reputation from this user because you do not have permission to do so.')
        }

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
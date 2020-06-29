const { Reputation } = require('../dbObjects');
const { Op } = require("sequelize");

module.exports = {
    name: 'repcount',
    aliases: ['countrep', 'totalrep', 'sumrep'],
    args: true,
    usage: '<user>',
    description: 'Count net total reputation of a user. Calculated by taking the total positive reputation and subtracting all negative reputation',
    guildOnly: true,
    async execute(message, args) {
        if (!message.mentions.users.size) {
            return message.reply('you need to tag a user to count their rep!');
        }

        const taggedUser = message.mentions.users.first();

        const positive_rep_count = await Reputation.count({
            where: {
                [Op.and]: [
                    { guild_id: message.guild.id },
                    { user_id: taggedUser.id },
                    { rep_positive: true }
                ]
            }
        });

        const negative_rep_count = await Reputation.count({
            where: {
                [Op.and]: [
                    { guild_id: message.guild.id },
                    { user_id: taggedUser.id },
                    { rep_positive: false }
                ]
            }
        });

        if(positive_rep_count || negative_rep_count) {
            const totalRep = positive_rep_count - negative_rep_count;

            return message.channel.send(`${taggedUser.tag}\'s total rep is: \`${totalRep}\`. This user has \`${positive_rep_count}\` positive rep and \`${negative_rep_count}\` negative rep.`);
        }

        return message.reply(`No reputation was found.`);
    },
};
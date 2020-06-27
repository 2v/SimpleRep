module.exports = {
    name: 'addrep',
    args: true,
    usage: '<user> <description>',
    description: 'Give a reputation to the tagged user with a reason',
    guildOnly: true,
    async execute(message, args) {
        const { v4: uuidv4 } = require('uuid');
        const { Reputation } = require('../dbObjects');

        if (!message.mentions.users.size) {
            return message.reply('you need to tag a user in order to give reputation!');
        }

        const taggedUser = message.mentions.users.first();
        const repDescription = args.slice(1).join(' ');

        if (repDescription.length < 12) {
            return message.reply('You need to provide a longer reason for adding reputation!');
        }

        if (repDescription.length > 80) {
            return message.reply(`The reputation reason can not be longer than 80 characters. Your's was ${tagDescription.length} characters!`);
        }

        var reputation_id = uuidv4().substr(0, 8);

        try {
            const reputation = await Reputation.create({
                rep_id: reputation_id,
                guild_id: message.guild.id,
                user_id: taggedUser.id,
                user_name: taggedUser.tag,
                rep_given_by: message.author.tag,
                rep_given_by_id: message.author.id,
                description: repDescription
            });
            return message.reply(`Rep added to ${taggedUser.tag} successfully.`);
       }
       catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.reply('That rep UUID already exists.');
            }
            return message.reply('Something went wrong with adding reputation.');
        }
    },
};
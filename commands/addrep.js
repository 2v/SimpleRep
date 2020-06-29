const { v4: uuidv4 } = require('uuid');
const { Reputation } = require('../dbObjects');

module.exports = {
    name: 'addrep',
    aliases: ['plusrep'],
    args: true,
    usage: '<user> <description>',
    description: 'Give a reputation to the tagged user with a reason',
    guildOnly: true,
    async execute(message, args) {
        if (!message.mentions.users.size) {
            return message.reply('you need to tag a user in order to give reputation!');
        }

        const taggedUser = message.mentions.users.first();
        const repDescription = args.slice(1).join(' ');

        if (taggedUser === message.author) {
            return message.reply('You cannot give reputation to yourself!');
        }

        if (taggedUser.bot) {
            return message.reply('You cannot give reputation to a bot! (even if they are a very kind bot D:)');
        }

        let guild = message.guild;

        if (!guild.member(taggedUser)) {
            return message.reply('The user must be in the guild to check their reputation!');
        }

        if (repDescription.length < 12) {
            return message.reply('You need to provide a longer reason for adding reputation!');
        }

        if (repDescription.length > 80) {
            return message.reply(`The reputation reason cannot be longer than 80 characters. Your's was ${repDescription.length} characters!`);
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
                rep_positive: true,
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
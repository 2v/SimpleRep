const { v4: uuidv4 } = require('uuid');
const { Reputation } = require('../dbObjects');

module.exports = {
    name: 'negrep',
    cooldown: 86400,
    variable_cooldown: true,
    admin_cooldown: 3,
    trader_cooldown: 36000,
    reputable_cooldown: 14400,
    trusted_cooldown: 600,
    aliases: ['minusrep', 'minrep', '-rep', '--rep', '-r'],
    args: true,
    usage: '<user> <description>',
    description: 'Give a negative reputation to a user with a reason',
    guildOnly: true,
    async execute(message, args) {
        if (!message.mentions.users.size) {
            message.reply('you need to tag a user in order to give reputation!');
            return 100;
        }

        const taggedUser = message.mentions.users.first();
        const repDescription = args.slice(1).join(' ');

        if (taggedUser === message.author) {
            message.reply('You cannot give reputation to yourself! (Also why would you want to give yourself negative rep huh?)');
            return 100;
        }

        if (taggedUser.bot) {
            message.reply('You cannot give reputation to a bot! (even if they are a very noddy bot, sorry)');
            return 100;
        }

        let guild = message.guild;

        if (!guild.member(taggedUser)) {
            message.reply('The user must be in the guild to check their reputation!');
            return 100;
        }

        if (repDescription.length < 12) {
            message.reply('You need to provide a longer reason for adding reputation!');
            return 100;
        }

        if (repDescription.length > 80) {
            message.reply(`The reputation reason cannot be longer than 80 characters. Your's was ${repDescription.length} characters!`);
            return 100;
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
                rep_positive: false,
                description: repDescription
            });
            message.reply(`Negative rep added to ${taggedUser.tag} successfully.`);
            return 200;
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                message.reply('That rep UUID already exists.');
                return 100;
            }
            message.reply('Something went wrong with adding reputation.');
            return 100;
        }
    },
};
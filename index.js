const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { prefix, token } = require('./config.json');
const { v4: uuidv4 } = require('uuid');

const client = new Discord.Client();
const PREFIX = '!';

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
})

/*
 equivalent to: CREATE TABLE tags (
 name VARCHAR(255),
 description TEXT,
 username VARCHAR(255),
 usage INT
 );
 */
const Reputation = sequelize.define('reputation', {
    guild_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rep_given_by: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rep_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
})

client.once('ready', () => {
    Reputation.sync();
    console.log('Ready!');
});

client.on('message', async message => {
    if (message.content.startsWith(PREFIX)) {
        const input = message.content.slice(PREFIX.length).split(' ');
        const command = input.shift();
        const commandArgs = input.join(' ');

        if (command === 'addrep' && (message.mentions.users.size !== 0)) {
            if (!message.mentions.users.size) {
                return message.reply('you need to tag a user in order to give reputation!');
            }

            const splitArgs = commandArgs.split(' ').slice(1);
            const taggedUser = message.mentions.users.first();
            const tagDescription = splitArgs.join(' ');

            if (tagDescription.length < 12) {
                return message.reply('You need to provide a longer reason for adding reputation!');
            }

            if (tagDescription.length > 80) {
                return message.reply(`The reputation reason can not be longer than 80 characters. Your's was ${tagDescription.length} characters!`);
            }
            var reputation_id = uuidv4()
            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                const reputation = await Reputation.create({
                    guild_id: message.guild.id,
                    user_id: taggedUser.id,
                    user_name: taggedUser.tag,
                    rep_given_by: message.author.tag,
                    description: tagDescription,
                    rep_id: reputation_id
                });
                // check here if a user can rank up
                return message.reply(`Rep added to ${taggedUser.tag} successfully.`);
            }
            catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return message.reply('That rep UUID already exists.');
                }
                return message.reply('Something went wrong with adding reputation.');
            }

        } else if (command === 'rep') {
            if (!message.mentions.users.size) {
                return message.reply('you need to tag a user in order to give reputation!');
            }
            const taggedUser = message.mentions.users.first();

            // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
            const tag = await Tags.findOne({ where: { name: tagName } });
            if (tag) {
                // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
                tag.increment('usage_count');
                return message.channel.send(tag.get('description'));
            }
            return message.reply(`Could not find tag: ${tagName}`);

        } else if (command === 'edittag') {
            const splitArgs = commandArgs.split(' ');
            const tagName = splitArgs.shift();
            const tagDescription = splitArgs.join(' ');

            // equivalent to: UPDATE tags (descrption) values (?) WHERE name='?';
            const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
            if (affectedRows > 0) {
                return message.reply(`Tag ${tagName} was edited.`);
            }
            return message.reply(`Could not find a tag with name ${tagName}.`);

        } else if (command === 'taginfo') {
            const tagName = commandArgs;

            // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
            const tag = await Tags.findOne({ where: { name: tagName } });
            if (tag) {
                return message.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
            }
            return message.reply(`Could not find tag: ${tagName}`);

        } else if (command === 'showtags') {
            // equivalent to: SELECT name FROM tags;
            const tagList = await Tags.findAll({ attributes: ['name'] });
            const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
            return message.channel.send(`List of tags: ${tagString}`);

        } else if (command === 'removetag') {
            const tagName = commandArgs;
            // equivalent to: DELETE from tags WHERE name = ?;
            const rowCount = await Tags.destroy({ where: { name: tagName } });
            if (!rowCount) return message.reply('That tag did not exist.');

            return message.reply('Tag deleted.');

        }
    }
});

client.login(token);

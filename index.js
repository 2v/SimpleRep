const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { prefix, token } = require('./config.json');
const { v4: uuidv4 } = require('uuid');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

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
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(token);
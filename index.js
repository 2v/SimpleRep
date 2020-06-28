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

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const trader_role = message.guild.roles.cache.find(role => role.name === 'Trader');
    const reputatable_role = message.guild.roles.cache.find(role => role.name === 'Reputable');
    const trusted_role = message.guild.roles.cache.find(role => role.name === 'Trusted');

    if (!trader_role || !reputatable_role || !trusted_role) {
        if (!trader_role) {
            message.guild.roles.create({
                data: {
                    name: 'Trader',
                    color: 'PURPLE',
                },
                reason: 'Created missing \'Trader\' role',
            })
                .then(console.log)
                .catch(console.error);
        }
        if (!reputatable_role) {
            message.guild.roles.create({
                data: {
                    name: 'Reputable',
                    color: 'BLUE',
                },
                reason: 'Created missing \'Reputable\' role',
            })
                .then(console.log)
                .catch(console.error);
        }
        if (!trusted_role) {
            message.guild.roles.create({
                data: {
                    name: 'Trusted',
                    color: 'GREEN',
                },
                reason: 'Created missing \'Trusted\' role',
            })
                .then(console.log)
                .catch(console.error);
        }
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

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
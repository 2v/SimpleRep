const fs = require('fs');
const { Prefix } = require('./dbObjects.js');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { token } = require('./config.json');
const { v4: uuidv4 } = require('uuid');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async message => {
    if(message.author.bot) return;

    let prefix;
    let prefix_data = await Prefix.findOne({ where: { guild_id: message.guild.id } });

    if (!prefix_data) {
        prefix = '!';
    } else {
        prefix = prefix_data.prefix;
    }

    if (!message.content.startsWith(prefix)) return;

    let trader_role, reputable_role, trusted_role;
    if (!(message.channel.type === "dm")) {
        trader_role = message.guild.roles.cache.find(role => role.name === 'Trader');
        reputable_role = message.guild.roles.cache.find(role => role.name === 'Reputable');
        trusted_role = message.guild.roles.cache.find(role => role.name === 'Trusted');

        if (!trader_role || !reputable_role || !trusted_role) {
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
            if (!reputable_role) {
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
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.admin) {
        if(!message.member.permissions.has('ADMINISTRATOR', true)) {
            return message.reply('You do not have permission to use this command.')
        }
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);

    let cooldownAmount;

    if (message.member.roles.cache.has(trusted_role.id) && command.trusted_cooldown > 0) {
        cooldownAmount = command.trusted_cooldown  * 1000;
    } else if (message.member.roles.cache.has(reputable_role.id) && command.reputable_cooldown > 0) {
        cooldownAmount = command.reputable_cooldown  * 1000;
    } else if (message.member.roles.cache.has(trader_role.id) && command.trader_cooldown > 0) {
        cooldownAmount = command.trader_cooldown  * 1000;
    } else {
        cooldownAmount = (command.cooldown || 3) * 1000;
    }

    if(message.member.permissions.has('ADMINISTRATOR', true)) {
        cooldownAmount = (command.admin_cooldown || 3) * 1000;
    }

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) +  cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            if (timeLeft > 3600) {
                return message.reply(`please wait ${(timeLeft/3600).toFixed(1)} more hour(s) before using the \`${command.name}\` command.`);
            } else if (timeLeft > 60) {
                return message.reply(`please wait ${(timeLeft/60).toFixed(1)} more minute(s) before using the \`${command.name}\` command.`);
            } else {
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before using the \`${command.name}\` command.`);
            }
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args).then(reason => {
            if (reason === 100) {
                timestamps.delete(message.author.id);
            }
        });
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(token);
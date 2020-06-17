const Discord = require('discord.js');
const client = new Discord.Client();

const { prefix, token } = require("./config.json");

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.author.bot) return;

    console.log(message.content);

    if (message.content === `${prefix}ping`) {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.');
    }

});

client.login(token);

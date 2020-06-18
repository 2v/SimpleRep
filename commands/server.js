module.exports = {
    name: 'server',
    description: 'Show information about server',
    execute(message, args) {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    },
};
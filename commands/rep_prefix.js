const { Prefix } = require('../dbObjects');

module.exports = {
    name: 'rep_prefix',
    args: true,
    admin: true,
    usage: '<prefix>',
    description: 'Set the desired server prefix to use for SimpleRep. The default prefix is \`!\`',
    guildOnly: true,
    async execute(message, args) {
        let formatted_prefix = String(args[0]);

        if (formatted_prefix.length > 3 || formatted_prefix.includes('\`')) {
            return message.reply(`\`${ formatted_prefix }\` cannot be used as a prefix.`);
        }

        const prefix_entry = await Prefix.findOne({ where: { guild_id: message.guild.id } });

        if(prefix_entry) {
            await prefix_entry.update({ prefix: formatted_prefix });
            return message.reply(`Sucessfully changed prefix to \`${ formatted_prefix }\``);
        } else {
            try {
                await Prefix.create({
                    guild_id: message.guild.id,
                    prefix: formatted_prefix
                })
                return message.reply(`Sucessfully changed prefix to \`${ formatted_prefix }\``);
            }
            catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return message.reply('Entry already exists.');
                }
                return message.reply('Something went wrong with adding reputation.');
            }

        }
    }
}
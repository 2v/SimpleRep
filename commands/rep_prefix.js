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

        if (formatted_prefix.length > 2) {
            message.reply(`\`${ formatted_prefix }\` is too long to be a prefix.`);
            return 100;
        }

        let allowed = true;

        let code, i, len;
        for (i = 0, len = formatted_prefix.length; i < len; i++) {
            code = formatted_prefix.charCodeAt(i);
            if (!(code > 32 && code < 48) &&
                !(code > 57 && code < 91) &&
                !(code > 96 && code < 123)) {
                allowed = false;
            }
        }

        if(!allowed) {
            message.reply(`\`${ formatted_prefix }\` cannot be used as a prefix.`);
            return 100;
        }

        const prefix_entry = await Prefix.findOne({ where: { guild_id: message.guild.id } });

        if(prefix_entry) {
            await prefix_entry.update({ prefix: formatted_prefix });
            message.reply(`Sucessfully changed prefix to \`${ formatted_prefix }\``);
            return 200;
        } else {
            try {
                await Prefix.create({
                    guild_id: message.guild.id,
                    prefix: formatted_prefix
                })
                message.reply(`Sucessfully changed prefix to \`${ formatted_prefix }\``);
                return 200;
            }
            catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    message.reply('Entry already exists.');
                    return 100;
                }
                message.reply('Something went wrong with adding reputation.');
                return 100;
            }

        }
    }
}
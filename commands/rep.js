const Discord = require('discord.js');
const { Reputation } = require('../dbObjects');
const { Op } = require("sequelize");

module.exports = {
    name: 'rep',
    aliases: ['checkrep', 'userrep', 'repuser'],
    cooldown: 10,
    admin_cooldown: 3,
    args: true,
    usage: '<user>',
    description: 'Display the accumulated rep of a user',
    guildOnly: true,
    async execute(message, args) {
        if (!message.mentions.users.size) {
            message.reply('you need to tag a user in order to view their reputation!');
            return 100;
        }

        const taggedUser = message.mentions.users.first();

        if (taggedUser.bot) {
            message.reply('You cannot check the reputation of a bot!');
            return 100;
        }

        let guild = message.guild;

        if (!guild.member(taggedUser)) {
            message.reply('The user must be in the guild to check their reputation!');
            return 100;
        }

        var pages = [];

        // SELECT * FROM post WHERE guild_id = message.guild.id AND user_id = message.author.id;
        await Reputation.findAll({
            attributes: [
                'rep_given_by',
                'description',
                'rep_id'
            ],
            where: {
                [Op.and]: [
                    { guild_id: guild.id },
                    { user_id: taggedUser.id }
                ]
            }
        }).then(guildData => {
            if (!guildData.length) {
                return pages.push('This user has no reputation');
            }

            let numIterations = guildData.length / 10;

            for(let i = 0; i < numIterations; ++i) {
                //console.log('loop started');
                let line = "";
                for(let j = (i)*10; j < (i+1)*10; ++j) {
                    if (j === (guildData.length)) {
                        break;
                    }
                    line = line.concat(guildData[j].rep_given_by, ': ', guildData[j].description, ' [', guildData[j].rep_id, ']\n')
                }

                pages.push(line);

            }
            // fulfillment
        }, reason => {
            message.reply('There was a problem querying the reputation database, please try again later.');
            return 100;
            // rejection
        });

        let page = 1;

        const embed = new Discord.MessageEmbed()
            .setTitle(taggedUser.tag + '\'s Reputation')
            .setThumbnail(taggedUser.displayAvatarURL({ format: "png", dynamic: true }))
            .setColor(0xffffff)
            .setFooter(`Page ${page} of ${pages.length}`)
            .setDescription(pages[page-1])

        message.channel.send(embed).then(msg => {
            msg.react('◀').then( r => {
                msg.react('▶')

                //Filters
                const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
                const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;

                const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000});
                const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000});

                // This runs when the backwards reaction is found
                backwards.on('collect', r => {
                    if (page === 1) return;
                    page--;
                    embed.setDescription(pages[page-1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    msg.edit(embed);
                })

                // This runs when the forwards reaction is found
                forwards.on('collect', r => {
                    if (page === pages.length) return;
                    page++;
                    embed.setDescription(pages[page-1]);
                    embed.setFooter(`Page ${page} of ${pages.length}`);
                    msg.edit(embed);
                })
            })
        })
    },

};
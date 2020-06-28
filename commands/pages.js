module.exports = {
    name: 'pages',
    description: 'give multiple pages',
    execute(message, args) {
        const Discord = require('discord.js');
        // inline field max width is 74
        let pages = ['tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)\n' +
        'tb#0001: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cc90ee5e)', 'Page two!', 'Page three!', 'Page four'];
        let page = 1;

        const embed = new Discord.MessageEmbed()
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
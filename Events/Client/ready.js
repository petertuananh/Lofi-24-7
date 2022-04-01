const ascii = require('ascii-table');
const table = new ascii("Gotoubun Ready");
table.setHeading("List", " Details");

module.exports.run = client => {
	const user = client.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c)
        table.addRow(`Bot Name`, `${client.user.username}`)
        table.addRow(`Bot Handler`, `Credits by Elaina Team`)
        table.addRow(`Total Guilds`, `${client.guilds.cache.size} guilds`)
        table.addRow(`Total Users`, `${user} users`)
        table.addRow(`Total Commands`, `${client.commands.size} commands`)
        table.addRow(`Total Slashs`, `${client.slashcommands.size} slashs`)
        console.log(table.toString().rainbow);

    client.user.setActivity({
        type: 'WATCHING',
        name: `${client.guilds.cache.size} Servers | ${user} Users`,
    });
    client.guilds.cache.forEach(async guild=>{
        const channelID = await client.db.get(`channel-${guild.id}`)
        const channel = await guild.channels.cache.get(channelID)
        client.distube.play(channel, client.config.general.link, {
            member: 'Auto',
            textChannel: "Null",
            guild
        }).catch(e=>{return})
    })
    client.on('voiceStateUpdate', (channel) => {
        channel.setSuppressed(false).catch(e=>{return})
    })
};
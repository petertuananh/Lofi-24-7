const Discord = require("discord.js");

module.exports.run = async (client, message) => {

    const embed = new Discord.MessageEmbed()
        .setColor(client.config.general.errorID)
        // .setFooter({ text: `Made by ${client.user.username}` , iconURL: client.user.displayAvatarURL() })

    if (message.author.bot) return;
    if (!message.guild) {
        embed.setDescription(`**・Commands are not supported in DMs\n・Please use the bot in a server**`)
        return await message.reply({
            embeds: [embed]
        })
    }

    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();

    const mentionRegPrefix = RegExp(`^<@!?${client.user.id}> `);

    let botprefix = await client.db.fetch(`prefix_${message.guild.id}`);
    if (botprefix === null) {
        botprefix = client.config.bot.clientPrefix
    };

    const prefix = message.content.match(mentionRegPrefix) ? message.content.match(mentionRegPrefix)[0] : botprefix;

    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
	if (!command) return;

    if (command) {
        if (command.ownerOnly) {
            if (message.author.id !== client.config.general.ownerID) {
                embed.setTitle(`**Permissions**`)
                embed.setDescription(`**・Limited this commands to owners only**`)
                return message.channel.send({
                    embeds: [embed]
                })
            }
        }
        command.run(client, message, args, prefix);
    }    
}
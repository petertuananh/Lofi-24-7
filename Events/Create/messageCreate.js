const Discord = require("discord.js");
const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
    MessageButton
} = require('discord.js')
module.exports.run = async (client, message) => {
    if (message.content == client.user || message.content == client.user.tag || message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`){
        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setStyle("LINK")
            .setURL(client.config.general.invite)
            .setEmoji('<:LinkVIP:915188532228792330>')
            .setLabel('Invite'),
            new MessageButton()
            .setStyle("LINK")
            .setURL(client.config.general.support)
            .setEmoji('<a:dev:927042918827577365>')
            .setLabel('Support'),
            new MessageButton()
            .setStyle("LINK")
            .setURL(client.config.general.support)
            .setEmoji('<a:dev:927042918827577365>')
            .setLabel('Dashboard'),
        )
        const embed = new MessageEmbed()
        .setColor(client.config.general.embedColor)
        .setTitle(`Hello!`)
        .setDescription(`**${client.emoji.music} I can play Lofi and any kind of 24/7 music**`)
        message.channel.send({
            embeds: [embed],
            components: [row]
        })
    };

    const embed = new Discord.MessageEmbed()
        .setColor(client.config.general.errorID)

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

    let botprefix = await client.db.fetch(`prefix-${message.guild.id}`);
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
        const embedPerm = new MessageEmbed()
        .setTitle(`${client.emoji.music} ${client.user.username}`)
        .setColor(client.config.general.embedColor)
        .setDescription(`> ${client.emoji.deny} You are not allow to use this command!`)
        if (command.Perm){
            const checked = await client.db.get(`everyone-${message.guild.id}`)
            if(!checked){
                if(!message.member.permissions.has("MANAGE_GUILD")){
                    return message.reply({embeds: [embedPerm]})
                }
            }
        }
        command.run(client, message, args, prefix);
    }    
}
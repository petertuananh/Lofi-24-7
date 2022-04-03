const { MessageEmbed } = require("discord.js");
const db = require('quick.db')
module.exports = {
    name: "prefix",
    aliases: ["px"],
    category: "Information",
    description: "Return Bot Latencies",
    cooldown: 5,
    ownerOnly : false,
    UserPerms: ["ADMINISTRATOR"],
    run: async (client, message, args) => {
        const prefix = args[0]
        const embed = new MessageEmbed()
            .setTitle(`${client.emoji.music} ${client.user.username}`)
            .setColor(client.config.general.embedColor)
        if(!prefix){
            embed.setDescription(`${client.emoji.deny} Must provide new prefix!`)
            return message.reply({embeds: [embed]})
        } else {
            await db.set(`prefix-${message.guild.id}`, prefix)
            embed.setDescription(`${client.emoji.allow} Set new prefix to ${prefix}`)
            return message.reply({embeds: [embed]})
        }
    }
}
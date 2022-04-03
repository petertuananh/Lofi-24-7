const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "stop",
    aliases: ["st"],
    category: "Lofi",
    description: "Stop play Lofi 24/7",
    cooldown: 5,
    ownerOnly : false,
    UserPerms: ["MANAGE_SERVER"],
    Perm: true,
    run: async (client, message, args) => {
        client.db.delete(`channel-${message.guild.id}`)
        client.distube.voices.leave(message)
        const embed = new MessageEmbed()
            .setTitle(`${client.emoji.music} ${client.user.username}`)
            .setColor(client.config.general.embedColor)
            .setDescription(`> ${client.emoji.music} Stopped lofi music`)
        return message.reply({embeds: [embed]})
    }
}
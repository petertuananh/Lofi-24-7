const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "stop",
    description: "Stop music",
    category: "Information",
    cooldown: 5,
    ownerOnly : false,
    UserPerms: ["MANAGE_SERVER"],
    BotPerms: ["ADMINISTRATOR"],
    run: async (client, interaction, args) => {
        client.db.delete(`channel-${interaction.guild.id}`)
        client.distube.voices.leave(interaction)
        const embed = new MessageEmbed()
            .setTitle(`${client.emoji.music} ${client.user.username}`)
            .setColor(client.config.general.embedColor)
            .setDescription(`> ${client.emoji.music} Stopped lofi music`)
        return interaction.reply({embeds: [embed]})
    }
}
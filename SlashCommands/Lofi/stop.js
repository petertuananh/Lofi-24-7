const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "stop",
    description: "Stop music",
    category: "Information",
    cooldown: 5,
    ownerOnly : false,
    UserPerms: ["MANAGER_SERVER"],
    BotPerms: ["ADMINISTRATOR"],
    run: async (client, interaction, args) => {
        client.db.delete(`channel-${interaction.guild.id}`)
        const embed = new MessageEmbed()
            .setTitle('Lofi 24/7')
            .setColor('#8a6f1d')
        client.distube.voices.leave(interaction)
        embed.setDescription(`> Stopped lofi`)
        return interaction.reply({embeds: [embed]})
    }
}
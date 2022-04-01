const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "lofi",
    description: "Play 24/7 Lofi music",
    category: "Information",
    cooldown: 5,
    ownerOnly : false,
    UserPerms: ["MANAGER_SERVER"],
    BotPerms: ["ADMINISTRATOR"],
    run: async (client, interaction, args) => {
        client.db.set(`channel-${interaction.guild.id}`, interaction.member.voice.channel.id)
        const embed = new MessageEmbed()
            .setTitle('Lofi 24/7')
            .setColor('#8a6f1d')
        client.distube.play(interaction.member.voice.channel, client.config.general.link, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
        })
        embed.setDescription(`> Playing lofi in ${interaction.member.voice.channel}`)
        return interaction.reply({embeds: [embed]})
    }
}
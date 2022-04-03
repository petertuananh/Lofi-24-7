const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'volume',
    description: "Change the volume",
    cooldown: 5,
    ownerOnly: false,
    UserPerms: ["MANAGE_SERVER"],
    inVoiceChannel: true,
    options: [
        {
            name: "number",
            description: "Change the volume",
            type: "NUMBER",
            required: true
        }
    ],
    run: async (client, interaction, args) => {
        const queue = client.distube.getQueue(interaction)
        if (!queue) return interaction.reply(`There is nothing in the queue right now!`)
        const volume = interaction.options.getNumber('number')
        // if (isNaN(volume)) return message.channel.send(`Please enter a valid number!`)
        queue.setVolume(volume)
        const embed = new MessageEmbed()
        .setTitle(`${client.emoji.music} ${client.user.username}`)
        .setColor(client.config.general.embedColor)
        .setDescription(`${client.emoji.allow} Volume successfull set to \`${volume}\``)
        interaction.reply({ embeds: [embed]})//xd
    }
}
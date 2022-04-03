const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'prefix',
    description: "Change the prefix",
    cooldown: 5,
    ownerOnly: false,
    UserPerms: ["MANAGE_GUILD"],
    inVoiceChannel: true,
    options: [
        {
            name: "target",
            description: "Provide new prefix",
            type: "STRING",
            required: true
        }
    ],
    run: async (client, interaction, args) => {
        const prefix = interaction.options.getSring('target')
        await client.db.set(`prefix-${interaction.guild.id}`, prefix)
        const embed = new MessageEmbed()
        .setTitle(`${client.emoji.music} ${client.user.username}`)
        .setColor(client.config.general.embedColor)
        .setDescription(`${client.emoji.allow} prefix successfull set to \`${prefix}\``)
        return interaction.reply({ embeds: [embed]})
    }
}
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "help",
    description: "Show all of commands",
    category: "Information",
    cooldown: 5,
    ownerOnly : false,
    run: async (client, interaction, args) => {
        const commands1 = client.commands
        const commands2 = client.slashcommands
        const embed2 = new MessageEmbed()
            .setTitle(`${client.emoji.music} ${client.user.username} Help`)
            .setColor(client.config.general.embedColor)
            .addField(`${client.emoji.slash} Slash`, commands2.map(x => ` > ┕ \`${x.name}\` \n`).join(''), true)
            .addField(`${client.emoji.prefix} Prefix`, commands1.map(x => ` > ┕ \`${x.name}\` \n`).join(''), true)
        return interaction.reply({embeds: [embed2]})
    }
}
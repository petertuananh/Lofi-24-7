const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, interaction) => {

    const embed = new MessageEmbed()
        .setColor(client.config.general.errorID)

    if (interaction.guild == null) {
        embed.setDescription(`**・Commands are not supported in DMs\n・Please use the bot in a server**`)
        return await interaction.reply({
            embeds: [embed]
        })
    }

    if (interaction.isCommand() || interaction.isContextMenu()) {
        const command = client.slashcommands.get(interaction.commandName);

        embed.setDescription('**・An error occured while running this command ✖**')
        if (!command) return interaction.reply({
            embeds : [embed]
        }) && client.slashcommands.delete(interaction.commandName);;

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === 'SUB_COMMAND') {
                if (option.name) args.push(option.name);
                option.options?.forEach(x => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }

        const embedPerm = new MessageEmbed()
        .setTitle(`${client.emoji.music} ${client.user.username}`)
        .setColor(client.config.general.embedColor)
        .setDescription(`> ${client.emoji.deny} You are not allow to use this command!`)
        if (command.Perm){
            const checked = await client.db.get(`everyone-${interaction.guild.id}`)
            if(!checked){
                if(!interaction.member.permissions.has("MANAGE_GUILD")){
                    return interaction.reply({embeds: [embedPerm]})
                }
            }
        }
        if (command.ownerOnly) {
            if (interaction.member.id !== client.config.general.ownerID) {
                embed.setDescription(`**・Limited this commands to owners only**`)
                embed.setTitle(`**Permissions**`)
                return interaction.reply({
                    embeds: [embed]
                })
            }
        }

        command.run(client, interaction, args)
    }
}
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
        // await interaction.deferReply({
        //     ephemeral: false
        // }).catch(() => {});

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

        const upEmbed = new MessageEmbed()
            .setColor('#3d35cc')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription("You're missing permission!")
            .addField("You need", `\`${command.UserPerms || []}\``)
            .setTimestamp()

        const bpEmbed = new MessageEmbed()
            .setColor('#3d35cc')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription("Bot is missing permission!")
            .addField("Bot need:", `\`${command.BotPerms || []}\``)
            .setTimestamp()
        if (!interaction.guild.me.permissions.has(command.BotPerms || [])) return interaction.reply({
            embeds: [bpEmbed]
        })
        if (!interaction.member.permissions.has(command.UserPerms || [])) return interaction.reply({
            embeds: [upEmbed]
        })
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
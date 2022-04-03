const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "lofi",
    description: "Play 24/7 Lofi music",
    category: "Information",
    cooldown: 5,
    ownerOnly: false,
    UserPerms: ["MANAGE_SERVER"],
    BotPerms: ["ADMINISTRATOR"],
    run: async (client, interaction, args) => {

        client.distube.voices.leave(interaction)
        client.db.set(`channel-${interaction.guild.id}`, interaction.member.voice.channel.id)
        const music = await client.db.get(`link-${interaction.guild.id}`)
        const link = music || client.config.general.link
        client.distube.play(interaction.member.voice.channel, link, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
        })


        
        // client.distube
        //     .on('playSong', (queue, song) =>{
        //         const embed = new MessageEmbed()
        //             .setTitle(`${client.user.username}`)
        //             .setThumbnail(`${song.thumbnail}`)
        //             .setColor(client.config.general.embedColor)
        //             .setDescription(`> ${client.emoji.play} Playing lofi in ${interaction.member.voice.channel}`)
        //             .addField(`${client.emoji.stream} Live in:`, `${interaction.member.voice.channel}`, true)
        //         queue.textChannel.send({embeds: [embed]})
        //     })
        const embed = new MessageEmbed()
            .setTitle(`${client.emoji.music} ${client.user.username}`)
            .setColor(client.config.general.embedColor)
            .setDescription(`> ${client.emoji.music} Playing lofi in ${interaction.member.voice.channel}`)
        return interaction.reply({ embeds: [embed] })
    }
}
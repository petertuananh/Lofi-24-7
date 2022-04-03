const { MessageEmbed } = require("discord.js");
const { db } = require("../../NinoBot");

module.exports = {
    name: "lofi",
    aliases: ["lf"],
    category: "Lofi",
    description: "Play Lofi 24/7",
    cooldown: 5,
    ownerOnly : false,
    UserPerms: ["ADMINISTRATOR"],
    UserPerms: ["MANAGE_SERVER"],
    Perm: true,
    run: async (client, message, args) => {
        client.distube.voices.leave(message)
        client.db.set(`channel-${message.guild.id}`, message.member.voice.channel.id)
        const music = await db.get(`link-${message.guild.id}`)
        const link = music || client.config.general.link
        client.distube.play(message.member.voice.channel, link, {
            member: message.member,
            textChannel: message.channel,
            message
        })
        // client.distube
        //     .on('playSong', (queue, song) =>{
        //         const embed = new MessageEmbed()
        //             .setTitle(`${client.user.username}`)
        //             // .setThumbnail(`${song.thumbnail}`)
        //             .setColor(client.config.general.embedColor)
        //             .setDescription(`> ${client.emoji.music} Playing lofi`)
        //             .addField("Live in:", `${message.member.voice.channel}`, true)
        //             .setImage(`${song.thumbnail}`)

        //         queue.textChannel.send({embeds: [embed]})
        //     })
        const embed = new MessageEmbed()
            .setTitle(`${client.emoji.music} ${client.user.username}`)
            .setColor(client.config.general.embedColor)
            .setDescription(`> ${client.emoji.music} Playing lofi in ${message.member.voice.channel}`)
            // .setImage(`${client.distube.getQueue(message).thumbnail}`)
        return message.reply({embeds: [embed]})
    }
}


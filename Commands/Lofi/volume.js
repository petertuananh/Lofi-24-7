const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'volume',
    aliases: ['v', 'set', 'set-volume'],
    description: "Change the volume",
    cooldown: 5,
    ownerOnly : false,
    UserPerms: ["MANAGE_SERVER"],
    inVoiceChannel: true,
    Perm: true,
    run: async (client, message, args) => {
      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send(`There is nothing in the queue right now!`)
      const volume = parseInt(args[0])
      if (isNaN(volume)) return message.channel.send(`Please enter a valid number!`)
      queue.setVolume(volume)
      const embed = new MessageEmbed()
      .setTitle(`${client.emoji.music} ${client.user.username}`)
      .setColor(client.config.general.embedColor)
      .setDescription(`${client.emoji.allow} Volume successfull set to \`${volume}\``)
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send({ embeds: [embed]})
    }
  }
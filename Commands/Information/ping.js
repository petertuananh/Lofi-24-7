const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["p"],
    category: "Information",
    description: "Return Bot Latencies",
    cooldown: 5,
    ownerOnly : false,
    // UserPerms: ["ADMINISTRATOR"],
    run: async (client, message, args) => {

        const embed = new MessageEmbed()
            .setDescription('`Pinging...`')
            .setColor(client.config.general.successID);

        const msg = await message.reply({
            embeds: [embed]
        });

        const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp;

        const latency = `${Math.floor(msg.createdTimestamp - timestamp)} ms`;
        const apiLatency = `${message.client.ws.ping - 19} ms`;

        embed.setDescription(`・Client Ping : \`${latency}\`\n・API Ping : \`${apiLatency}\``)
        msg.edit({
            embeds: [embed]
        });
    }
}
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Return Bot Latencies",
    category: "Information",
    cooldown: 5,
    ownerOnly : false,
    // UserPerms: ["ADMINISTRATOR"],
    run: async (client, interaction, args) => {

        const embed = new MessageEmbed()
            .setDescription('・Pinging...')
            .setColor(client.config.general.successID);

        const msg = await interaction.reply({
            embeds: [embed]
        });

        const timestamp = (interaction.editedTimestamp) ? interaction.editedTimestamp : interaction.createdTimestamp;

        const latency = `  ${Math.floor(msg.createdTimestamp - timestamp)} ms`;
        const apiLatency = `  ${interaction.client.ws.ping - 19} ms`;

        embed.setDescription(`・Client Ping : ${latency}\n・API Ping : ${apiLatency}`)

        msg.edit({
            embeds: [embed]
        });
    }
}
const colors = require('colors');
const { DisTube } = require('distube')
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const fs = require('fs');
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const client = new Client({
    intents: 32767,
    partials: ["USER", "CHANNEL", "MESSAGE", "GUILD_MEMBER", "REACTION"],
    disableMentions: ['everyone', 'here'],
})
client.distube = new DisTube(client, {
    leaveOnStop: false,
    leaveOnEmpty: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    nsfw: true,
    plugins: [
        new SpotifyPlugin({
          emitEventsAfterFetching: true
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
      ],
    youtubeDL: false
})

client.distube
    .on('playSong', (queue, song) =>{
        setTimeout(() => {
            client.on('voiceStateUpdate', (user) => {
                if (user.id == client.user.id){
                    // if (user.channel.type == 'GUILD_STAGE_VOICE'){
                        user.guild.me.voice.setSuppressed(false).catch(e=>{return})
                    // }
                }
            })
        }), 10000
    })
module.exports = client;
client.db = db;
client.config = require('./Settings/Configuration/config.js');
client.emoji = require('./Settings/Configuration/emojis.js');
client.commands = new Collection();
client.aliases = new Collection();
client.slashcommands = new Collection();
/*
['command_Handler', 'event_Handler', 'slash_Handler'].forEach(handler => {
	require(`./Handlers/${handler}`)(client);
});
*/
const res = fs.readdirSync('./Handlers');
res.map(name => require(`./Handlers/${name}`)(client));
client.login(client.config.bot.clientToken).catch(e=>{return console.log(e)})
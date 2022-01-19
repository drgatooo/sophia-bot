const { Client, MessageEmbed, MessageButton, MessageSelectMenu, MessageActionRow } = require('discord.js');
const wait = require('util').promisify(setTimeout);
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'activity',
    aliases: ['actividad'],
    description: 'inicia una actividad de discord-together',
    category: 'Diversion',
    premium: false,

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
		if(!message.member.voice.channel) return message.reply('Debes ejecutar este comando en un canal de voz!');
        const embedStarting = new MessageEmbed()
        .setDescription('elige una actividad!\n*tienes 30 segundos para elegir*')
        .setColor('RANDOM')
        .setAuthor(message.author.username, message.author.avatarURL());
        
        const embedActivity = new MessageEmbed().setTitle('Presiona el link para entrar a la actividad!');
        const options = new MessageSelectMenu()
        .setCustomId("options")
        .setPlaceholder('Seleciona una actividad!')
        .setMaxValues(1)
        .addOptions([
            {
                label: "Youtube",
                description: "Inicia una sesión de youtube",
                emoji: '<:youtube:904511439321047110>',
                value: 'youtube'
            },
            {
                label: "Poker",
                description: "Inicia una sesión de poker",
                emoji: '<:pokercard:904512176801325067>',
                value: "poker"
            },
            {
                label: "Ajedrez",
                description: "Inicia una sesión de ajedrez",
                emoji: '<:chess:904513069655420938>',
                value: "chess"
            },
            {
                label: "Betrayal",
                description: "Inicia una sesión de el juego betrayal",
                emoji: '<:betrayal:904514303615451146>',
                value: "betrayal"
            },
            {
                label: "Pesca",
                description: "Inicia una sesión de un juego de pesca",
                emoji: '🎣',
                value: "fishing"
            },
            {
                label: "Sopa de letras",
                description: "Inicia una sesión de un juego de sopa de letras",
                emoji: '<:lettertitle:904515794006855690>',
                value: 'lettertitle'
            }
        ]);
        const menu = new MessageActionRow()
        .addComponents(options);
        
        const msj = await message.reply({ embeds: [embedStarting], components: [menu]});
        const collector = msj.createMessageComponentCollector({ time: 30000 });
        
        collector.on('collect', async i => {
            if(i.user.id !== message.author.id) return i.reply({content: "No puedes interferir en el comando de otra persona!", ephemeral: true});
            switch(i.values[0]){
                case "youtube":
                    i.deferUpdate();
                    client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube', message).then(async invite => {
    					embedActivity.setDescription(invite.code);
						if(invite.code == "https://discord.com/invite/50013") return embedActivity.setDescription('No se pudo crear la invitación, verifica que tenga permisos de ver el canal y crear invitaciones en ese canal de voz!');
					});
                    await wait(500);
				   msj.edit({ embeds: [embedActivity], components: []});
                    break;
                case "poker":
                    i.deferUpdate();
                    client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'poker', message).then(async invite => {
    					embedActivity.setDescription(invite.code);
                        if(invite.code == "https://discord.com/invite/50013") return embedActivity.setDescription('No se pudo crear la invitación, verifica que tenga permisos de ver el canal y crear invitaciones en ese canal de voz!');
					});
                    await wait(500);
                   msj.edit({ embeds: [embedActivity], components: []});
                    break;
                case "chess":
                    i.deferUpdate();
                    client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'chess', message).then(async invite => {
    					embedActivity.setDescription(invite.code);
                        if(invite.code == "https://discord.com/invite/50013") return embedActivity.setDescription('No se pudo crear la invitación, verifica que tenga permisos de ver el canal y crear invitaciones en ese canal de voz!');
					});
                    await wait(500);
                   msj.edit({ embeds: [embedActivity], components: []});
                    break;
				case "betrayal":
                    i.deferUpdate();
                    client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'betrayal', message).then(async invite => {
    					embedActivity.setDescription(invite.code);
                        if(invite.code == "https://discord.com/invite/50013") return embedActivity.setDescription('No se pudo crear la invitación, verifica que tenga permisos de ver el canal y crear invitaciones en ese canal de voz!');
					});
                    await wait(500);
                   msj.edit({ embeds: [embedActivity], components: []});
                    break;
                case "fishing":
                    i.deferUpdate();
                    client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'fishington', message).then(async invite => {
    					embedActivity.setDescription(invite.code);
                        if(invite.code == "https://discord.com/invite/50013") return embedActivity.setDescription('No se pudo crear la invitación, verifica que tenga permisos de ver el canal y crear invitaciones en ese canal de voz!');
					});
                    await wait(500);
                   msj.edit({ embeds: [embedActivity], components: []});
                    break;
               case "lettertitle":
                    i.deferUpdate();
                    client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'lettertile', message).then(async invite => {
    					embedActivity.setDescription(invite.code);
                        if(invite.code == "https://discord.com/invite/50013") return embedActivity.setDescription('No se pudo crear la invitación, verifica que tenga permisos de ver el canal y crear invitaciones en ese canal de voz!');
					});
                    await wait(500);
                   msj.edit({ embeds: [embedActivity], components: []});
                    break;
                    
            }
        });
    }
}

module.exports = command

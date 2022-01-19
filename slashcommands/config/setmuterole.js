const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");
const setMute = require('../../models/setmuterole.js');

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ['MANAGE_ROLES'],
    botPerms: ['MANAGE_ROLES'],
    category: "Configuración",


    data: new SlashCommandBuilder()
    .setName("setmuterole")
    .setDescription("Establece el rol de mute")
    .addRoleOption(o =>
        o.setName('rol')
        .setDescription('El rol que se usará para los muteos.')
        .setRequired(true)),
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(_, interaction){
        let role = interaction.options.getRole('rol');
        const establecido = new MessageEmbed()
        .setTitle('✅ Hecho!')
        .setDescription('Se ha agregado el rol exitosamente.')
        .setColor('GREEN')

        const actualizado = new MessageEmbed()
        .setTitle("✅ Hecho!")
        .setDescription("El rol ha sido actualizado correctamente!.")
        .setColor("GREEN")

        const muterol = await setMute.findOne({ ServerID: interaction.guild.id});
        if(!role.editable) return interaction.reply({embeds:[
            new MessageEmbed()
            .setTitle("❌ Error")
            .setDescription("No puedes editar este rol.")
            .setColor('RED')
        ], ephemeral: true});
        if (role.tags) {
        const NoTag = new MessageEmbed()
        .setTitle('❌ Error')
        .setDescription("El rol es de un bot.")
        .setColor('RED')
            return interaction.reply({embeds: [NoTag], ephemeral: true});
        }

        role = role.id;

        if (!muterol) {
            let rolmute = new setMute({
                ServerID: interaction.guild.id,
                RoleID: role
            })
            await rolmute.save()
            return interaction.reply({embeds: [establecido]})
        }

        if(muterol){
            let rolmute = new setMute({
                ServerID: interaction.guild.id,
                RoleID: role
            })
            await rolmute.save()
            return interaction.reply({ embeds: [actualizado], ephemeral: true })
        }
    }
}

module.exports = command;
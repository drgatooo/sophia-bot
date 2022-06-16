const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");

module.exports = {
    userPerms: ['BAN_MEMBERS'],
    category: 'Moderación',
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario")
    .addUserOption(o => o.setName('usuario').setDescription('usuario a banear').setRequired(true))
    .addStringOption(o => o.setName('razón').setDescription('razón del baneo (opcional)').setRequired(false)),

    async run(client, interaction){
        const args = interaction.options;
        const member = interaction.guild.members.cache.get(args.getUser('usuario').id);
        let reason = args.getString('razón');
        if(!reason) reason = 'sin especificar';
        
        if(member.user.bot) interaction.reply({embeds: [new MessageEmbed().setTitle(':x: Error').setDescription('no puedo banear a un bot!').setColor('RED')], ephemeral: true});

        if(member.user.id === interaction.member.id) return interaction.reply({embeds: [new MessageEmbed().setTitle(':x: Error').setDescription('no puedes autobanearte!').setColor('RED')], ephemeral: true});
        
        if(member.user.id === client.user.id) return interaction.reply({embeds: [new MessageEmbed().setTitle(':x: Error').setDescription('no puedo autobanearme').setColor('RED')], ephemeral: true});
        
        if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.member.guild.ownerId !== interaction.member.id) return interaction.reply({ embeds: [new MessageEmbed().setTitle(':x: Error').setDescription('No puedes banear a alguien con mayor rol al tuyo').setColor('RED')], ephemeral: true});
        
        if(!member.bannable) return interaction.reply({embeds: [new MessageEmbed().setTitle(':x: Error').setDescription('no puedo banear a ese usuario').setColor('RED')], ephemeral: true});
        
        const success = new MessageEmbed()
      		.setTitle("👋 Miembro baneado")
      		.setDescription("El usuario fue baneado con exito del servidor!")
      		.setColor("GREEN")
      		.addField('👤 Miembro: ',`${member}`,true)
      		.addField("👮‍♂️ Staff: ", `<@${interaction.member.id}>`,true)
      		.setTimestamp();
        if(reason !== 'sin especificar'){
            success.addField("💥 Razón: ", reason, true)
        }
        
       await member.ban({reason}).then(() => interaction.reply({embeds: [success]}))
        .catch(err => {
            interaction.reply({ content: 'ocurrio un error, ya fue notificado a mis creadores.', ephemeral: true});
			console.log(err);
		});
    }
}
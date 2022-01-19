const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require("../../models/warn-model.js");

/**
* @type {import('../../types/typeslasg').Command}
*/

const command = {

    userPerms: ['MANAGE_NICKNAMES'],
    botPerms: ['ADMINISTRATOR'],
    category: "Moderación",


    data: new SlashCommandBuilder()
    .setName("removewarn")
    .setDescription("Elimina una advertencia especifica a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Menciona al usuario para rmeover una advertencia.").setRequired(true))
    .addNumberOption(o => o.setName("numero-de-advertencia").setDescription("Ingresa el número de la advertencia a remover.").setRequired(true)),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){
    const args = interaction.options

    let noPosible = new MessageEmbed()
    .setTitle('❌ Error')
    .setColor('RED')

	  const mention = args.getUser("usuario");
      const numero = args.getNumber("numero-de-advertencia")
      const Results = await schema.findOne({guildId: interaction.guild.id, userId: mention.id});

      if(Results && Results.warnings.length <= 0) await schema.deleteOne({guildId: interaction.guild.id, userId: mention.id});
  	  schema.findOne({ guildId: interaction.guild.id, userId: mention.id}, async (err, results) => {
      if(err) throw err;
      if(results) {
          if(numero === 0) return interaction.reply({embeds: [noPosible.setDescription('ℹ Ingresa un numero mayor a `0` !')], ephemeral: true});
        	let number = parseInt(numero) - 1;
        	if(results.warnings.length < number) return interaction.reply({embeds: [noPosible.setDescription(`ℹ El usuario solo cuenta con \`${results.warnings.length}\` Advertencias!`)], ephemeral: true});
          
          let { reason } = await results.warnings[number]
          let { author } = await results.warnings[number]
          
          let Posible = new MessageEmbed()
          .setTitle('✅ Advertencia removida')
          .addField('👤 Usuario:',`${mention}`,true)
          .addField('👮‍♂️ Staff a cargo:',`<@${interaction.user.id}>`,true)
          .addField('💂‍♂️ Ejecutor del warn:',`<@${author}>`,true)
          .addField('📕 Motivo del warn:',`\`\`\`${reason}\`\`\``)
          .setColor('GREEN')
        	interaction.reply({embeds: [Posible]});
        	results.warnings.splice(number, 1);
        	results.save();
          return
    } else {
        return interaction.reply({embeds: [noPosible.setDescription('ℹ El usuario no cuenta con advertencias.')], ephemeral: true});
    }
  });

    }

}

module.exports = command;
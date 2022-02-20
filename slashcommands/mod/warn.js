const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const schema = require("../../models/warn-model");

/**
* @type {import('../../types/typeslash').Command}
*/

const command = {

    userPerms: ["KICK_MEMBERS"],
    botPerms: ["KICK_MEMBERS"],
    category: "Moderación",


    data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Da una advertencia a un usuario.")
    .addSubcommand(o =>
        o.setName("add")
        .setDescription("Da una advertencia a un usuario.")
            .addUserOption(o => o.setName("usuario").setDescription("Usuario a warnear").setRequired(true))
            .addStringOption(o => o.setName("razon").setDescription("Motivo de la warn.").setRequired(false))
    )
    .addSubcommand(o =>
        o.setName("clearwarns")
        .setDescription("Elimina las advertencias de un usuario.")
            .addUserOption(o => o.setName("usuario").setDescription("Usuario a mirar").setRequired(true))
    )
    .addSubcommand(o =>
        o.setName("removewarn")
        .setDescription("Elimina una advertencia especifica a un usuario.")
            .addUserOption(o => o.setName("usuario").setDescription("Menciona al usuario para rmeover una advertencia.").setRequired(true))
            .addNumberOption(o => o.setName("numero-de-advertencia").setDescription("Ingresa el número de la advertencia a remover.").setRequired(true))
    )
    .addSubcommand(o =>
        o.setName("allwarns")
        .setDescription("Mira las advertencias de un usuario.")
            .addUserOption(o => o.setName("usuario").setDescription("Menciona al usuario a mutear").setRequired(true))
    ),

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction){

    const subcmd = interaction.options.getSubcommand()
    const noPosible = new MessageEmbed()
    .setTitle('❌ Error')
    .setColor('RED')
        
    if(subcmd === "add"){
        
    const user = interaction.options.getMember("usuario");
    if(user.id === interaction.user.id) return interaction.reply({embeds: [noPosible.setDescription('ℹ No puedes warnearte a vos mismo')], ephemeral: true});
    if(user.id === client.user.id) return interaction.reply({embeds: [noPosible.setDescription('ℹ No puedo warnearme a mi misma')], ephemeral: true});
    if(user.bot) return interaction.reply({embeds: [noPosible.setDescription('ℹ No puedo warnear a un bot')], ephemeral: true});
    if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) <= 0) return interaction.reply({embeds: [noPosible.setDescription('ℹ No puedes warnear a alguien con mayor o igual rol que tu.')], ephemeral: true});
    
        const guildId = interaction.guild.id;
        const userId = user.id;
        let reason = interaction.options.getString("razon")
        if(!reason) reason = "Sin especificar";
        if(reason.length > 50) return interaction.reply({embeds: [noPosible.setDescription('ℹ Solo puedes poner hasta 50 caracteres!')], ephemeral: true});
    
        const warning = {
            author: interaction.user.id,
            timestamp: new Date().getTime(),
            reason
        };
            try {
       await schema.findOneAndUpdate({
           guildId,
           userId
       }, {
           guildId,
           userId,
           $push: {
               warnings: warning
           }
       }, {
           upsert: true
       });
            } catch (err) {
                interaction.reply("Hubo un error inesperado, espera a que lo solucionemos! (ya fue enviado a mis creadores)");
                console.log(err.stack);
            }
        const embedSuccess = new MessageEmbed()
        .setTitle('⚠ Warns')
        .addField('👤 Usuario warneado:',`${user}`,true)
        .addField('👮‍♂️ Staff a cargo:', `<@${interaction.user.id}>`,true)
        .addField('📕 Razon:',`\`\`\`${reason}\`\`\``)
        .setColor("ORANGE");
        const embedUser = new MessageEmbed()
        .setTitle("🔔 Te han warneado!")
        .addField('🏛 Servidor:',`${interaction.guild.name}`,true)
        .addField('👮‍♂️ Staff a cargo:', `<@${interaction.user.id}>`,true)
        .addField('📕 Razon:',`\`\`\`${reason}\`\`\``)
        .setFooter({text: "Comportate bien!"})
        .setColor("RED")
        .setTimestamp();
        interaction.reply({embeds: [embedSuccess]});
        user.send({embeds: [embedUser]}).catch(err=>{return});
        }

    if(subcmd === "clearwarns"){
        const args = interaction.options;
        const e = new MessageEmbed()
        .setTitle(":x: Error")
        .setColor("DARK_RED")

        const mention = args.getUser("usuario")
        const results = await schema.findOne({
            guildId: interaction.guild.id,
            userId: mention.id
      });

        if(!schema.findOne({guildId: interaction.guild.id, userId: mention.id})) return interaction.reply({embeds: [e.setDescription("Este usuario no tiene sanciones en este servidor!")], ephemeral: true });
        if(!results) return interaction.reply({embeds: [e.setDescription("Este usuario no tiene sanciones en este servidor!")], ephemeral: true });
      
        
    const msg = new MessageEmbed()
    .setDescription(`Estas seguro que quieres eliminar todas las sanciones de **${mention.tag}**?`)
    .setColor("RED")
    
    let row = new MessageActionRow()
        .addComponents(
        
        new MessageButton()
        .setLabel("continuar")
        .setCustomId("accept")
        .setStyle("SUCCESS"),
        
        new MessageButton()
        .setLabel("cancelar")
        .setCustomId("cancel")
        .setStyle("DANGER")
    );
    
      

        const embedFin = new MessageEmbed()
        .setDescription(`**Todas las Sanciones de ese usuario han sido eliminadas**\n
        **INFO:**\n
        **NOMBRE DEL USUARIO:** \`${mention.username}\`\n
        **DISCRIMINADOR DEL USUARIO:** \`${mention.discriminator}\`\n
        **TAG DEL USUARIO:** \`${mention.tag}\``)
        .setColor("GREEN")
        .setTimestamp()
        .setFooter(`${interaction.user.username}`, interaction.user.displayAvatarURL());
      
        await interaction.reply({embeds: [msg], components: [row] });
        const filtro = b => b.user.id === interaction.user.id;
        
        const collector = interaction.channel.createMessageComponentCollector({filter: filtro, time: 60000}); 
        collector.on('collect', async(b) => {
          if(b.user.id !== interaction.user.id) return b.reply({embeds: [e.setDescription("Solo el que puso el comando puede interactuar con el mismo!")], ephemeral: true});
          if(b.customId == 'accept'){
              b.deferUpdate();
              await schema.findOneAndDelete({guildId: interaction.guild.id, userId: mention.id});
              await interaction.editReply({embeds: [embedFin]});
          }
          if(b.customId == 'cancel'){
              b.deferUpdate();
              b.interaction.delete();
          }
        });
    }

    if(subcmd === "removewarn"){
        const args = interaction.options
    
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
    
    if(subcmd === "allwarns"){
        const mention = interaction.options.getUser("usuario") || interaction.user;
        const guildId = interaction.guild.id;
        const userId = mention.id;
                    
             const warns = new MessageEmbed()
            .setTitle(`⚠ Advertencias de ${mention.username}`)
            .setThumbnail(mention.displayAvatarURL({dynamic: true}))
            .setColor('YELLOW')
    
             
        if(userId === client.user.id) return interaction.reply({embeds: [noPosible.setDescription('ℹ No puedo tener warns!')], ephemeral: true});
        if(mention.bot) return interaction.reply({embeds: [noPosible.setDescription('ℹ Los bots no pueden tener warns!')], ephemeral: true});
            const results = await schema.findOne({
                guildId,
                userId
            });
            if(!results) return interaction.reply({embeds: [noPosible.setDescription('ℹ Este usuario no tiene warns!')], ephemeral: true});
            if(!results.warnings[0]) return interaction.reply({embeds: [noPosible.setDescription('ℹ Este usuario no tiene warns!')], ephemeral: true});
                interaction.reply({embeds: [warns
                    .setDescription(
                        results.warnings.map((w, i) => 
                        `\n**#${i+1}**\n📕 Razon:\n${w.reason}\n💂‍♂️ Ejecutor del warn:\n<@${w.author}>\n⌚ Hace: <t:${Math.round(w.timestamp / 1000)}:R>\n---------------`
                    ).join(""))
            ]});
    }

    }
}

module.exports = command;
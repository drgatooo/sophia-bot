const { Client, Message, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const VirusTotalApi = require("virustotal-api");


/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'check',
    aliases: [],
    description: 'Revisa si un link posee malware´s',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Utility',
    premium: false,
    uso: "check <url>",

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        function scan() {
        const keys = ['f1870162fd8cfaba9038098ae8cf572402d4b81a3b6f1f692c20dfbf40c0f0f0', 'f278b6718c67c33dc0a21e5ba6f31afd0d4b5c9ac34ca17ef49f4df07ff39c16', '4565f646807c4d8de4a951ec752f055e0b2c603e7664b3cd45a78af625ec0ee5', '0f4a6682eeee1f2dea3fe9704033cd62eeeeb141cc30cf2f43047c9d14bd0b1e', '1c6dd9489fbf12e70e1bdf97600b2539d3738ba5d6eb72433c4ee262cb382f65'];
        const virusTotal = new VirusTotalApi(keys[Math.floor(Math.random() * keys.length)]);
		function splitbywords(variable, empieza, termina) {
   var s = variable+' ',   // resuelve problema 1
      largo = s.length,
      posStart = Math.max(0, empieza == 0 ? 0 : s.indexOf(' ', empieza)),
      posEnd = Math.max(0, termina > largo ? largo : s.indexOf(' ', termina)),
      cadena = s.substr(posStart, posEnd);
  if (cadena.charAt(cadena.length-1) === ',') {     //resuelve problema 2
      cadena = cadena.substr(0, cadena.length-1);
  }
  return cadena;
}
        let url = args[0];
        if(!url){
            const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(":x: Error")
            .setDescription("Ingresa una url a escanear.");
            return message.reply({ embeds: [embed] });
        }
        
        if(!/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url)) return message.reply({ embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setTitle(":x: Error")
            .setDescription("Ingresa una url valida para escanear!")
        ]});

        const embedresultado = new MessageEmbed()
        .setTitle("📡 Sophia Scan")
        .setColor("GREEN")
        
        virusTotal.urlScan(url).then(async response => {
            let resource = response["resource"];
        virusTotal.urlReport(resource).then(result => {
			const results = new Array();
            const sorting = { "clean site": 2, "malicious site": 1};
            Object.values(result.scans).forEach(i => {
            for(let key in result.scans) {
                results.push(key+' : '+i.result);
            }
            });
            
            const btn = new MessageButton()
            .setLabel('Mas detalles')
            .setURL(result.permalink)
            .setStyle('LINK');
    		const row = new MessageActionRow()
            .addComponents(btn);
            let security = '😲 Esta pagina fue marcada como maliciosa por `'+result.positives+'` antivirus!';
            if(result.positives === 0) security = "✅ sitio seguro!";
            embedresultado.setDescription(security);
            message.reply({ embeds: [embedresultado], components: [row]});
        });
    }).catch(err => {
            scan();
        });
        }
        scan();
    }
}

module.exports = command
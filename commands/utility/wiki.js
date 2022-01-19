const { Client, Message, MessageEmbed } = require('discord.js')

const wiki = require('wikijs').default


/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'wikipedia',
    aliases: ['wikisearch','wiki'],
    description: 'Busca algo en la wikipedia!',
    userPerms: ['SEND_MESSAGES'],
    botPerms: ['SEND_MESSAGES'],
    category: 'Owner',
    premium: false,
    uso: '[palabra]',
    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
        
        let info

        let text = args.slice(0).join(' ')
        
        if (text) {
            try {
                
                let query = await wiki({ apiUrl: 'https://es.wikipedia.org/w/api.php' })
                .page(text)
                .then(pages => {
                     info = pages.info()
                })
                
                console.log(info)
                
                
            
            } catch (err) {
                console.log(err)
            }
            
            
            
            
        }
        
    }
}

module.exports = command


                
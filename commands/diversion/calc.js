const { Client, Message, MessageEmbed } = require('discord.js');
const simpleds = require("simply-djs");
/**
* @type {import('../../types/typesctructure').Command}
*/

const command = {
    name: 'calculadora',
    aliases: ['calc', 'calculator'],
    description: 'Abre una calculadora',
    category: 'Diversion',

    /** 
    * @param {Client} client
    * @param {Message} message
    * @param {string[]} args
    */


    run: async (client, message, args) => {
		 simpleds.calculator(message, {
        		embedColor: 'RANDOM',
             	credit: false
    });
    }
}

module.exports = command
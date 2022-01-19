const { readdirSync } = require('fs');
const { bgWhite, black } = require("colors")

module.exports = (client) => {

    readdirSync("./events/").forEach((file) => {
        const events = readdirSync('./events/').filter((file) => file.endsWith(".js"));
        for (let file of events) {
            let pull = require(`../events/${file}`);
            if (pull.name){
                client.events.set(pull.name,pull)
            } else {
                continue
            }
        }
    })
    console.log(bgWhite(black('Handler de Eventos listo.')))
}
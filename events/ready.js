const client = require(`../index`);
const { cyan, green, red } = require("colors"),
mongoose = require(`mongoose`),
fs = require("fs"),
toml = require("toml"),
config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8")),
mongoURl = config.MongoDB_URL;
let apiContent = new Object();

client.once("ready", async () => {
    mongoose.connect(mongoURl,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log(green('conectado a MongoDB'))
    }).catch((err) => {
        console.log(red(err));
    })
    console.log(`cliente listo en: ${cyan(`${client.user.tag}`)}` + "\n" + cyan(`
░██████╗░█████╗░██████╗░██╗░░██╗██╗░█████╗░
██╔════╝██╔══██╗██╔══██╗██║░░██║██║██╔══██╗
╚█████╗░██║░░██║██████╔╝███████║██║███████║
░╚═══██╗██║░░██║██╔═══╝░██╔══██║██║██╔══██║
██████╔╝╚█████╔╝██║░░░░░██║░░██║██║██║░░██║
╚═════╝░░╚════╝░╚═╝░░░░░╚═╝░░╚═╝╚═╝╚═╝░░╚═╝`));


const promesas = [
    client.shard.fetchClientValues(`guilds.cache.size`),
    client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
]


Promise.all(promesas).then(results => {
    const guildNum = results[0].reduce((acc, guildCount) => acc + guildCount, 0)
    const memberNum = results[1].reduce((acc, memberCount) => acc + memberCount, 0)

    apiContent.guildsSize = guildNum;
    apiContent.usersSize = memberNum;
    apiContent.guilds = client.guilds;

    fs.writeFileSync("./api/api.json", JSON.stringify(apiContent, null, 4));
    const readApiJson = JSON.parse(fs.readFileSync("./api/api.json", "utf-8"));
    setInterval(() => {
        if(readApiJson.guildsSize !== guildNum ||
            readApiJson.usersSize !== memberNum ||
                readApiJson.guilds !== client.guilds) {
                apiContent.guildsSize = guildNum;
                apiContent.usersSize = memberNum;
                apiContent.guilds = client.guilds;
                console.log(`${green("[")}${cyan("API")}${green("]")} ${green("Actualizando API...")}`);
                fs.writeFileSync("./api/api.json", JSON.stringify(apiContent, null, 4));
    }
    }, 3600000);

const status = { activities: [`/help`, `/invite`, `¡SOPHIA 3.0.7!`, `${guildNum} servidores.`, `${memberNum} Usuarios.`, `Sophia Company.`], activity_types: [`WATCHING`, `PLAYING`, `LISTENING`, `COMPETING`] }
const AutoPresence = () => {  
    let aleanum = Math.floor(Math.random() * status.activities.length);
    client.user.setPresence({
        activities: [{
            name: status.activities[aleanum],
            type: status.activity_types[aleanum],
        }]
    })
}


AutoPresence();
setInterval(() => {
    AutoPresence();
}, 60000)
console.log("Presencia del bot cargada exitosamente.")
    })

})
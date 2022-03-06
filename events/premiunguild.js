const premiumGuild = require('../models/premiumGuild')
const client = require("../index")

client.on("ready", () => {
    let expirePremiun = async (client) => {

        setInterval(async () => {
            let data = await premiumGuild.find()

            if(data.length > 0) {
                let now = Math.floor(Date.now() / 1000)
                let array = data

                function isExpirationTime(item){
                    if(item.expire - now <= 50){
                        return true;
                    } else {
                        return false;
                    }
                }

                array = array.filter(isExpirationTime)

                for(i in array){
                    try{

                        data = array[i];

                        let expire = data.expire
                        let timeRemaining = (expire - now) * 1000

                        let guild = client.guilds.cache.get(data.ServerID)

                        setTimeout(async () => {
                            await premiumGuild.deleteOne({ ServerID: guild.id })
                            console.log("Se desactivó el premiun en", guild.name)
                        }, timeRemaining)

                    } catch(e){

                    }
                }
            }
        }, 60000)

    }

    expirePremiun(client)
})

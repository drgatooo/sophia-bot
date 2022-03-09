const premiumGuild = require('../models/premiumGuild')
const blackuser = require("../models/blacklist-user");
const blackguild = require("../models/blacklist-guild");
const client = require("../index")



client.on("ready", async () => {
    //await blackguild.deleteOne({ ServerID: "848053120852688917" })
    expireBlacklist(client, blackuser)
    expireBlacklist(client, blackguild)
    expirePremiun(client)
})


//Funciones timeout

let expirePremiun = async (client) => {

    setInterval(async () => {
        let data = await premiumGuild.find()

        if (data.length > 0) {
            let now = Math.floor(Date.now() / 1000)
            let array = data

            function isExpirationTime(item) {
                if(item.expire == 0)return false
                if (item.expire - now <= 50) {
                    return true;
                } else {
                    return false;
                }
            }

            array = array.filter(isExpirationTime)

            for (i in array) {
                try {

                    data = array[i];

                    let expire = data.expire
                    let timeRemaining = (expire - now) * 1000

                    let guild = client.guilds.cache.get(data.ServerID)

                    setTimeout(async () => {
                        await premiumGuild.deleteOne({ ServerID: guild.id })
                        console.log("Se desactivó el premiun en", guild.name)
                    }, timeRemaining)

                } catch (e) {

                }
            }
        }
    }, 60000)

}

let expireBlacklist = async (client, db) => {

    setInterval(async () => {
        let data = await db.find()

        if (data.length > 0) {
            let now = Math.floor(Date.now() / 1000)
            let array = data

            function isExpirationTime(item) {
                if(item.expire === 0)return false;

                if (item.expire - now <= 50) {
                    return true;
                } else {
                    return false;
                }
            }

            array = array.filter(isExpirationTime)

            for (i in array) {
                try {

                    data = array[i];
                    
                    let expire = data.expire
                    let timeRemaining = (expire - now) * 1000

                    let guild = data.ServerID ? await client.guilds.cache.get(data.ServerID) : undefined
                    let user = data.UserID ? await client.users.fetch(data.UserID) : undefined

                    if(guild){
                        setTimeout(async () => {
                            await db.deleteOne({ ServerID: guild.id })
                            console.log("Se desactivó la blacklist del servidor", guild.name)
                        }, timeRemaining)
                    } else if(user){
                        setTimeout(async () => {
                            await db.deleteOne({ UserID: user.id })
                            console.log("Se desactivó la blacklist para", user.tag)
                        }, timeRemaining)
                    }


                } catch (e) {
                    console.log(e)
                }
            }
        }
    }, 60000)

}

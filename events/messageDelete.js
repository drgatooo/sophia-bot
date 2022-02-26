const client = require("../index")
const snipe = require("../models/snipe")

client.on("messageDelete", async message => {
    if(!message.author) return
    if(!message.author.bot) return
    if(message.channel.type === "DM") return

    let data = await snipe.findOne({ channelid: message.channel.id })

    if(!data){
        let newdata = new snipe({
            channelid: message.channel.id,
            message: message.content,
            author: message.author.tag,
            time: Math.floor(Date.now() / 1000 )
        })

        return await newdata.save()
    }

    await snipe.findOneAndUpdate({
        channelid: message.channel.id,
        message: message.content,
        author: message.author.tag,
        time: Math.floor(Date.now() / 1000 )
    })
})
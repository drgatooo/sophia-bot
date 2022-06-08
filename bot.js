const { ShardingManager } = require('discord.js')
const fs = require("fs")
const toml = require("toml")
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"))
const token = config.token

const manager = new ShardingManager('./index.js', { token: token, totalShards: "auto" });

manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`)
});
process.on("uncaughtException", (err) => {
    console.log("PROCESO uncaughtException: ", err);
});
process.on("exit", (code) => {
    console.log("PROCESO EXIT: ", code)
});

manager.spawn();
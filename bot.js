const { ShardingManager } = require('discord.js');
const fs = require("fs");
const toml = require("toml");
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"));

const manager = new ShardingManager('./index.js', { token:  config.token });

manager.on('shardCreate', (shard) => console.log(`Lanzando shard ${shard.id}`));

manager.spawn();
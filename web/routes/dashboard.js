const { Router } = require('express');
const auth = require("../util/auth.js");
const router = Router();

function verifyGuild(req, res) {
    const id = req.params.serverid;
    const guild = req.Client.guilds.cache.get(id);
    if (!guild) return res.json({
            error: "Servidor no encontrado",
        });
}

router.get('/panel', auth, (req, res) => {
    const types = {true: 0, false: 1};
    const guildsArray = new Array();
    const guilds = req.user.guilds.filter(g => (g.permissions & 8) === 8);
    for(const guild in guilds) {
            guildsArray.push({
                inside: req.Client.guilds.cache.get(guilds[guild].id) ? true : false,
                id: guilds[guild].id,
                name: guilds[guild].name,
                icon: guilds[guild].icon,
                shortName: guilds[guild].name.match(/\b(\w)/g).join(''),
            });
    }
    res.render("dashboard", {
        user: req.user,
        guildsArray: guildsArray.sort((a, b) => types[a.inside] - types[b.inside]),
    });
});

router.get('/panel/:serverid', auth, (req, res) => {
        verifyGuild(req, res);
        const guild = req.Client.guilds.cache.get(req.params.serverid);
        res.render('guildPanel', {
            guild,
            owner: guild.members.cache.get(guild.ownerId).user.tag,
            channels: guild.channels.cache.size,
            categories: guild.channels.cache.filter(c => c.type === "GUILD_CATEGORY").size,
            texts: guild.channels.cache.filter(c => c.type === "GUILD_TEXT").size,
            voices: guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size,
            roles: guild.roles.cache.size,
            membersTotal: guild.members.cache.size,
            membersOnline: guild.members.cache.filter(m => m.presence === "online").size,
            membersOffline: guild.members.cache.filter(m => m.presence === "offline").size,
        });
        console.log(guild.members.cache);
});

// router.get('/panel/:serverid/:command', auth, async (req, res) => {
//     verifyGuild(req, res);
//     const guild = req.Client.guilds.cache.get(req.params.serverid);
//     switch(req.params.command) {
//         case "prefix":
//                 const schema = require("../../models/setprefix.js");
//                 const db = await schema.findOne({ServerID: guild.id });
//                 console.log(db.PrefixID)
//                 res.render('commands/prefix', {guild, prefix: db.PrefixID});
//                 break;
//         }
// });

module.exports = router;
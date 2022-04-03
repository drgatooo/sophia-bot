const express = require('express');
const app = express();
const toml = require('toml');
const fs = require('fs');
const config = toml.parse(fs.readFileSync("./config/config.toml", "utf-8"))
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    if(req.query.token !== config.api_token || ! req.query.token) return res.send({ error: "Token no especificado o inválido.", code: "401 unauthorized" });
    res.send(fs.readFileSync("./api/api.json", "utf-8"));
});

app.listen(port, () => console.log(`API ready on port: ${port}`));
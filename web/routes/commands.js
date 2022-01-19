const { Router } = require('express');
const fetch = require('node-fetch');
const router = Router();

router.get('/commands', (_, res) => {
    fetch('http://localhost:3000/api/cmds')
        .then(res => res.json())
        .then(data => {
            $data = data.map(a=>a.category);
            const categories=$data.filter((a,t)=>data.map(a=>a.category).indexOf(a)===t);
            const obj = new Object();
                categories.forEach(c => {
                data.filter(cmd => cmd.category === c).forEach(commands => {
                    obj[c] = [...(obj[c] || []), commands];
                });
            });
            categories.forEach(item => console.log(obj[item]));
        });
});

module.exports = router;
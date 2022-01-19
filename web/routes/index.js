const { Router } = require('express');
const router = Router();

router.get('/', (_, res) => {
    const errors = new Array();
    errors.push({text: 'error 1', textID: null});
    res.render('index', {errors});
});

router.get("/login", require('passport').authenticate("discord"), (_, res) => {
    res.redirect("/panel");
});

router.get('/invite', (_, res) => res.redirect('https://discord.com/oauth2/authorize?client_id=864930156857786388&permissions=8&scope=bot'));

module.exports = router;

const { Router } = require('express');
const cmds = require('../../config/cmds.json');
const router = Router();

router.get('/api/cmds', (_, res) => {
    res.json(cmds);
});

module.exports = router;
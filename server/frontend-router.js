const express = require('express')
const router = express.Router();
var path = require('path');

router.get('/', async function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

module.exports = router
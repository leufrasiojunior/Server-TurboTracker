const express = require('express');
const { runSpeedtest } = require('./runSpeedtest');
const loadConfig = require('../Functions/loadConfigs');
const { scheduleSpeedtest} = require('../Functions/scheduleSpeedtest');


const router = express.Router();
loadConfig().then(config => {
    cronConfig = config;
    scheduleSpeedtest(cronConfig);
});
router.post('/runspeedtest', async (req, res) => {
    setTimeout(() => {
        runSpeedtest(false);
    }, 10000);
    res.json({ message: 'Speedtest Scheduled'});
})
module.exports = router

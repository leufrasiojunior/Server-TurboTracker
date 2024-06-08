const express = require('express');
const cron = require('node-cron');
const { runSpeedtest } = require('./runSpeedtest');
const loadConfig = require('../Functions/loadConfigs');
const { scheduleSpeedtest, stopCurrentTask } = require('../Functions/scheduleSpeedtest');


const router = express.Router();
loadConfig().then(config => {
    cronConfig = config;
    scheduleSpeedtest(cronConfig);
});
router.post('/runspeedtest', async (req, res) => {
    setTimeout(() => {
        runSpeedtest();
    }, 10000);
    res.json({ message: 'Speedtest Scheduled'});
})
module.exports = router

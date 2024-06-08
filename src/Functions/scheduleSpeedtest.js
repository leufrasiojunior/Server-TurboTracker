// /utils/scheduleSpeedtest.js
const cron = require('node-cron');
const { runSpeedtest } = require('../routes/runSpeedtest');

let currentTask = null;

const scheduleSpeedtest = (cronConfig) => {
    if (!cronConfig) return;

    stopCurrentTask();

    currentTask = cron.schedule(cronConfig, () => {
        runSpeedtest(true);
    });
};

const stopCurrentTask = () => {
    if (currentTask) {
        currentTask.stop();
        currentTask = null;
    }
};

module.exports = {
    scheduleSpeedtest,
    stopCurrentTask
};

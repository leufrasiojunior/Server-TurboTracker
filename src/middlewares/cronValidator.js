const { isValidCron } = require('cron-validator');

function validateCron(req, res, next) {
    const { scheduleTest } = req.body;

    if (scheduleTest) {
        const options = {
            alias: true,
            seconds: true,
        };

        if (!isValidCron(scheduleTest, options)) {
            return res.status(400).json({ message: 'Invalid cron expression for scheduleTest.' });
        }
    }
    next();
}

module.exports = validateCron;

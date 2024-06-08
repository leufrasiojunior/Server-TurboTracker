// /utils/__tests__/scheduleSpeedtest.test.js
const cron = require('node-cron');
const scheduleSpeedtest = require('../../src/Functions/scheduleSpeedtest');
const { runSpeedtest } = require('../../src/routes/runSpeedtest');

jest.mock('node-cron');
jest.mock('../../src/routes/runSpeedtest');

describe('scheduleSpeedtest', () => {
    beforeEach(() => {
        cron.schedule.mockClear();
        runSpeedtest.mockClear();
    });

    it('should not schedule a task if cronConfig is null', () => {
        scheduleSpeedtest(null);
        expect(cron.schedule).not.toHaveBeenCalled();
    });

    it('should stop the previous task if it exists and schedule a new one', () => {
        const cronConfig = '* * * * *';
        
        // Mock the stop function
        const mockStop = jest.fn();
        cron.schedule.mockReturnValue({ stop: mockStop });

        scheduleSpeedtest(cronConfig);
        expect(cron.schedule).toHaveBeenCalledTimes(1);
        expect(cron.schedule).toHaveBeenCalledWith(cronConfig, expect.any(Function));

        scheduleSpeedtest(cronConfig);
        expect(mockStop).toHaveBeenCalledTimes(1); // Previous task should be stopped
        expect(cron.schedule).toHaveBeenCalledTimes(2);
    });

    it('should call runSpeedtest when the scheduled task runs', () => {
        const cronConfig = '* * * * *';

        const scheduledFunction = cron.schedule.mock.calls[0][1];
        scheduledFunction();

        expect(runSpeedtest).toHaveBeenCalled();
    });
});

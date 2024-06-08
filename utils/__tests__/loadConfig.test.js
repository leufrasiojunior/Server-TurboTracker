// /utils/__tests__/loadConfig.test.js
const { PrismaClient } = require('@prisma/client');
const loadConfig = require('../../src/Functions/loadConfigs');

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        settings: {
            findMany: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mPrismaClient),
    };
});

describe('loadConfig', () => {
    const mockSettings = [
        { name: 'scheduleTest', payload: '* * * * *' }
    ];
    let prisma;

    beforeEach(() => {
        prisma = new PrismaClient();
        prisma.settings.findMany.mockClear();
    });

    it('should load cron config from the database', async () => {
        prisma.settings.findMany.mockResolvedValue(mockSettings);

        const cronConfig = await loadConfig();
        expect(cronConfig).toBe('* * * * *');
    });

    it('should return null if no config is found', async () => {
        prisma.settings.findMany.mockResolvedValue([]);

        const cronConfig = await loadConfig();
        expect(cronConfig).toBeNull();
    });

    it('should log an error if there is a problem loading the config', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const error = new Error('Database error');
        prisma.settings.findMany.mockRejectedValue(error);

        await loadConfig();
        expect(consoleSpy).toHaveBeenCalledWith('Error loading cron config:', error);
    });
});

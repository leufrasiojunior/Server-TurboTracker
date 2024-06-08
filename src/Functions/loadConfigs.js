// /utils/loadConfig.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const loadConfig = async () => {
    try {
        const config = await prisma.settings.findMany({
            where: { name: "scheduleTest" }
        });
        const cronConfig = config ? config[0].payload : null;
        return cronConfig;
    } catch (error) {
        console.error('Error loading cron config:', error);
    }
};

module.exports = loadConfig;

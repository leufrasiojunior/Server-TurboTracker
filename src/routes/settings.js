const express = require('express');
const loadConfig = require('../Functions/loadConfigs');
const { scheduleSpeedtest, stopCurrentTask } = require('../Functions/scheduleSpeedtest');
const validateCron = require ('../middlewares/cronValidator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

const saveOrUpdateSetting = async (name, value) => {
    const existingSetting = await prisma.settings.findFirst({
        where: { name },
    });

    if (!existingSetting) {
        await prisma.settings.create({
            data: {
                group: "general",
                name,
                payload: value,
            },
        });
    } else {
        await prisma.settings.update({
            where: {
                id: existingSetting.id,
            },
            data: {
                payload: value,
                updatedAt: new Date().toISOString(),
            },
        });
    }
};

router.post('/settings', validateCron, async (req, res) => {
    const { timezone, pruneData = null, scheduleTest = null } = req.body;

    try {
        await saveOrUpdateSetting("timezone", timezone);

        if (pruneData !== null) {
            await saveOrUpdateSetting("pruneData", pruneData);
        }

        if (scheduleTest !== null) {
            await saveOrUpdateSetting("scheduleTest", scheduleTest);
        }

        // Parar a tarefa de cron atual antes de carregar a nova configuração
        stopCurrentTask();

        // Carregar nova configuração de cron
        const cronConfig = await loadConfig();

        // Agendar teste de velocidade com nova configuração
        scheduleSpeedtest(cronConfig);

        return res.status(200).json({ message: 'Settings saved successfully!' });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/settings', async (req, res) => {
    try {
        const settings = await prisma.settings.findMany({
            where: {
                name: {
                    in: ["timezone", "pruneData", "scheduleTest"]
                }
            }
        });

        const response = settings.reduce((acc, setting) => {
            acc[setting.name] = setting;
            return acc;
        }, {});

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving settings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

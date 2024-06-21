const { exec } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const executeCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error: ${error}`);
                return;
            }
            if (stderr) {
                reject(`stderr: ${stderr}`);
                return;
            }
            resolve(stdout);
        });
    });
};

const runSpeedtest = async (isScheduled) => {
    let resultRecord;
    try {
        resultRecord = await prisma.results.create({
            data: {
                ping: null ,
                download: null ,
                upload: null ,
                packetloss: null ,
                comments: null ,
                data: null ,
                status: 'started',
                scheduled: isScheduled, 
                updated_at: new Date().toISOString(),
            },
        });
        const stdout = await executeCommand('speedtest --accept-license --accept-gdp --f=json-pretty');
        const result = JSON.parse(stdout);
        await prisma.results.update({
            where: { id: resultRecord.id },
            data: {
                ping: result.ping.latency,
                download: result.download.bandwidth,
                upload: result.upload.bandwidth,
                packetloss: result.packetLoss || 0,
                comments: '',
                data: JSON.stringify(result),
                status: 'completed',
                scheduled: isScheduled,
                updated_at: new Date().toISOString(),
            },
        });
    } catch (error) {
        if (resultRecord) {
            await prisma.results.update({
                where: { id: resultRecord.id },
                data: {
                    status: 'FAILED',
                    updated_at: new Date().toISOString(),
                    comments: `Error: ${error}`
                },
            });
        }
        console.error(`Error: ${error}`);
    }
};

module.exports = { runSpeedtest };

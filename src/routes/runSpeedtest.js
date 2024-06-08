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

const runSpeedtest = async () => {
    let resultRecord;
    try {
        // Create an initial result record with status STARTED
        resultRecord = await prisma.results.create({
            data: {
                ping: null ,
                download: null ,
                upload: null ,
                packetloss: null ,
                comments: null ,
                data: null ,
                status: 'started',
                scheduled: null, 
                updated_at: new Date().toISOString(),
            },
        });

        // Execute the speedtest command
        const stdout = await executeCommand('speedtest --f=json-pretty');
        const result = JSON.parse(stdout);

        // Update the result record with the actual data and status SUCCESS
        await prisma.results.update({
            where: { id: resultRecord.id },
            data: {
                ping: result.ping.latency,
                download: result.download.bandwidth,
                upload: result.upload.bandwidth,
                packetloss: result.packetLoss || 0,
                comments: '',
                data: JSON.stringify(result),
                status: 'success',
                scheduled: 0,
                updated_at: new Date().toISOString(),
            },
        });
    } catch (error) {
        // If there's an error, update the result record with status FAILED
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

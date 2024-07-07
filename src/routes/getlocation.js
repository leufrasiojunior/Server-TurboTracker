const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Função para normalizar e remover acentuação de strings
const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

router.get('/getlocation', async (req, res) => {
    try {
    const { startdate, enddate } = req.query;

    let dateFilter = {};

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (startdate) {
      const startDateTime = new Date(startdate);
      startDateTime.setHours(0, 0, 0, 0);
      dateFilter.gte = startDateTime.toISOString();
    } else {
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      dateFilter.gte = firstDayOfMonth.toISOString();
    }

    if (enddate) {
      const endDateTime = new Date(enddate);
      endDateTime.setHours(23, 59, 59, 999);
      dateFilter.lte = endDateTime.toISOString();
    } else {
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      lastDayOfMonth.setHours(23, 59, 59, 999);
      dateFilter.lte = lastDayOfMonth.toISOString();
    }

    const whereClause = {
      status: 'completed',
    };
    if (dateFilter.gte || dateFilter.lte) {
      whereClause.created_at = dateFilter;
    }

    const data = await prisma.results.findMany({
      where: whereClause,
      select: {
        data: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });


        const jsonData = data.map(result => JSON.parse(result.data));

        const locationData = jsonData.reduce((acc, item) => {
            const location = normalizeString(item.server.location); 

            if (!acc[location]) {
                acc[location] = {
                    location: location,
                    totalTests: 0,
                    totalDownload: 0,
                    totalUpload: 0,
                    totalPing: 0,
                    servers: {}
                };
            }

            acc[location].totalTests += 1;
            acc[location].totalDownload += item.download.bandwidth;
            acc[location].totalUpload += item.upload.bandwidth;
            acc[location].totalPing += item.ping.latency;

            const serverId = item.server.id;
            if (!acc[location].servers[serverId]) {
                acc[location].servers[serverId] = {
                    serverId: serverId,
                    totalTest: 0,
                    host: item.server.host,
                    sponsor: item.server.name,
                };
            }
            acc[location].servers[serverId].totalTest += 1;

            return acc;
        }, {});

        const result = Object.values(locationData).map(location => ({
            location: location.location,
            totalTests: location.totalTests,
            avarangeDownload: location.totalDownload / location.totalTests,
            avarangeUpload: location.totalUpload / location.totalTests,
            avarangePing: location.totalPing / location.totalTests,
            servers: Object.values(location.servers),
            sponsor: location.sponsor,
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

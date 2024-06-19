const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

router.get('/getservers', async (req, res) => {
  try {
    const { startdate, enddate } = req.query;


    let dateFilter = {};
    if (startdate) {
      const startDateTime = new Date(startdate);
      startDateTime.setHours(0, 0, 0, 0);
      dateFilter.gte = startDateTime;
    }
    if (enddate) {
      const endDateTime = new Date(enddate);
      endDateTime.setHours(23, 59, 59, 999);
      dateFilter.lte = endDateTime;
    }


    const whereClause = {};
    if (dateFilter.gte || dateFilter.lte) {
      whereClause.created_at = dateFilter;
    }

    const results = await prisma.results.findMany({
      where: whereClause,
      select: {
        data: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const jsonData = results.map(result => JSON.parse(result.data));
    const totalResults = jsonData.length;

    const hostCounts = jsonData.reduce((acc, item) => {
      const host = item.server.host;
      if (host) {
        acc[host] = (acc[host] || 0) + 1;
      }
      return acc;
    }, {});

    const serverCounts = Object.entries(hostCounts)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [host, count]) => {
        acc[host] = count;
        return acc;
      }, {});

    res.json({totalResults: totalResults, serverCounts});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.get('/packetLoss', async (req, res) => {
  try {
    // Buscar todos os resultados com packetloss maior que 0
    const results = await prisma.results.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        packetloss: {
          gt: 0
        },
      }
    });

    // Processar os resultados
    const processedResults = results.reduce((acc, result) => {
      const data = JSON.parse(result.data);
      const host = data.server.host;
      const id = data.server.id;

      if (!acc[host]) {
        acc[host] = {
          host: host,
          id: id,
          total: 0,
          packetloss: []
        };
      }

      acc[host].total += 1;
      acc[host].packetloss.push({
        id: result.id,
        packetloss: result.packetloss,
        created_at: result.created_at,
      });

      return acc;
    }, {});

    // Converter o objeto em um array
    const response = Object.values(processedResults);

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

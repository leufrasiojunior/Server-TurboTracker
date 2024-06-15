const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

router.get('/averages', async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
    
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
    
        const result = await prisma.results.aggregate({
          _avg: {
            download: true,
            ping:true,
            upload:true
          },
          where: {
            created_at: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });

        const totalUsedToAvarage = await prisma.results.count({
            where: {
              created_at: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
        });

        const downloads = result._avg.download ? Math.round(result._avg.download) : 0;
        const upload = result._avg.upload ? Math.round(result._avg.upload) : 0;
        const ping = result._avg.ping ? parseFloat(result._avg.ping.toFixed(2)) : 0.00;

        res.status(200).json({
            download: downloads,
            upload: upload,
            ping: ping,
            totalUsedToAvarage: totalUsedToAvarage
          });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

module.exports = router;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

router.get('/routetest', async (req, res) => {
    try {
        const data = await prisma.results.findMany({
            select: {
                data: true
            },
            where: {
                status: 'completed',
            },
            orderBy: {
                id: 'desc'
            },
        });

        const jsonData = data.map(result => JSON.parse(result.data));

        // Inicializa um objeto para armazenar a contagem de IDs por localização
        const locationIdDetailsMap = {};

        // Processa cada item do jsonData
        jsonData.forEach(item => {
            const location = item.server.location;
            const id = item.server.id;
            const host = item.server.host;

            if (location && id) {
                if (!locationIdDetailsMap[location]) {
                    locationIdDetailsMap[location] = [];
                }

                // Verifica se já existe um objeto com esse serverId na localização
                const existingItem = locationIdDetailsMap[location].find(obj => obj.serverId === id);
                if (existingItem) {
                    existingItem.totalTest++;
                } else {
                    locationIdDetailsMap[location].push({
                        serverId: id,
                        totalTest: 1,
                        host: host
                    });
                }
            }
        });

        res.json(locationIdDetailsMap);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

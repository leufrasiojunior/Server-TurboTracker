const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

router.get('/list-results', async (req, res) => {
    const cursor = req.query.cursor ? { id: parseInt(req.query.cursor) } : undefined;
    const take = parseInt(req.query.take) || 10;
    try {
        const totalRecords = await prisma.results.count();
        const results = await prisma.results.findMany({
            orderBy: { id: 'desc' },
            cursor: cursor,
            take: take,
        });
        const nextCursor = results.length > 0 ? results[results.length - 1].id : null;
        res.json({
            nextCursor,
            resultsLength: totalRecords,
            results
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching records' });
    }
});

router.get('/allresults', async (req, res) => {
    try {
        const results = await prisma.results.findMany();
        res.json({
            results
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching records' });
    }
});

router.get('/list-results/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const record = await prisma.results.findUnique({
        where: { id: Number(id) },
      });
  
      if (record) {
        res.json(record);
      } else {
        res.status(404).json({ error: 'Record not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;

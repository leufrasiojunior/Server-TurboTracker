const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await prisma.users.findUnique({
            where: { email },
          });
          if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
          }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.users.create({
            data: { email, password: hashedPassword },
        });
        res.status(201).send()
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
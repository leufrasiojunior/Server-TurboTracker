const express = require('express');
const cors = require('cors');
const login = require('./src/routes/login');
const register = require('./src/routes/register');
const settings = require('./src/routes/settings');
const schedule = require('./src/routes/schedule');
const cron = require('node-cron');
const {removeOldRecords} = require('./src/Functions/removeOldRecords')
const app = express();


app.use(cors());

app.use(express.json());

app.use('/api/v1', login)
app.use('/api/v1', register)
app.use('/api/v1', settings)
app.use('/api/v1', schedule)

cron.schedule('0 59 23 * * *', () => {
    removeOldRecords();
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

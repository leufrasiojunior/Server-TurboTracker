const express = require('express');
const axios = require('axios');
const router = express.Router();

// Função para buscar os servidores
const fetchHosts = async () => {
  try {
    const response = await axios.get('https://www.speedtest.net/api/js/servers', {
      params: {
        engine: 'js',
        https_functional: true,
        limit: 10,
      },
      timeout: 5000,
    });

    const data = response.data;
    data.sort((a, b) => a.distance - b.distance);
    return data.map(item => ({
      id: item.id,
      sponsor: item.sponsor,
      name: item.name,
      distance: item.distance
    }));
  } catch (error) {
    console.error('There was an issue retrieving Ookla speedtest servers, check the logs for more info.', error);
    return { '0': 'There was an issue retrieving Ookla speedtest servers, check the logs for more info.' };
  }
};

router.get('/gethosts', async (req, res) => {
  const hosts = await fetchHosts();
  res.json(hosts);
});

module.exports = router;
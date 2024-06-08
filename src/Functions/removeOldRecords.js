const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getPrunePayload() {
  try {
    const settings = await prisma.settings.findMany({
      where: {
        name: 'pruneData',
      },
    });

    let prunePayload = settings[0].payload;

    if (prunePayload.length === 0) {
      console.warn("No settings found with the name 'pruneData'");
      return null;
    }


    if (typeof prunePayload !== 'string') {
      console.error("Invalid payload type. Expected a string.");
      return null;
    }

    if (prunePayload === '0') {
      return null;
    }

    return parseInt(prunePayload, 10);
  } catch (e) {
    console.error(`Failed to retrieve or process 'pruneData' settings: ${e.message}`, e);
    return null;
  }
}

function getTenDaysAgo(prunePayload) {
  if (typeof prunePayload !== 'number') {
    console.error("Invalid prunePayload type. Expected a number.");
    return null;
  }
  
  const date = new Date();
  date.setDate(date.getDate() - prunePayload);
  return date;
}

async function removeOldRecords() {
  console.log('Removendo registros antigos...');
  try {
    const prunePayload = await getPrunePayload();
    if (prunePayload === null || prunePayload == 0 || prunePayload == undefined) {
      return;
    }

    const tenDaysAgo = getTenDaysAgo(prunePayload);
    if (!tenDaysAgo) {
      return;
    }

    const result = await prisma.resultss.deleteMany({
      where: {
        created_at: {
          lt: tenDaysAgo,
        },
      },
    });
    console.log(`Registros removidos: ${result.count}`);
  } catch (error) {
    console.error('Erro ao remover registros antigos:', error);
  }
}

module.exports = {
  removeOldRecords,
};

removeOldRecords()
require('dotenv').config();
const fs = require('fs');
const https = require('https');

const _context = require('./src/context/AppDbContext'); 
const app = require('./src/app');

const PORT = process.env.PORT || 3000; 

const credentials = {
  key: fs.readFileSync('./server.key', 'utf8'),
  cert: fs.readFileSync('./server.cert', 'utf8')
};

async function initApplication() {
  try {
    await _context.sequelize.sync();
    console.log('AppDbContext: Veritabanı ve tablolar başarıyla senkronize edildi.');

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(PORT, () => {
      console.log(`HTTPS Sunucu aktif: https://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Uygulama başlatma hatası:', error);
  }
}

initApplication();

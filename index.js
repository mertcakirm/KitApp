require('dotenv').config();
const http = require('http');
const _context = require('./src/context/AppDbContext'); 
const app = require('./src/app');
const seedDatabase = require('./src/config/seed');

const PORT = process.env.PORT || 3000; 

async function initApplication() {
  try {
    await _context.sequelize.sync();
    console.log('AppDbContext: Veritabanı ve tablolar başarıyla senkronize edildi.');
    
    await seedDatabase(_context);
    
    const httpServer = http.createServer(app);

    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`HTTP Sunucu aktif: http://localhost:${PORT}`);
      console.log(`Docker dışından erişim adresi: http://127.0.0.1:${PORT}`);
    });
    
  } catch (error) {
    console.error('Uygulama başlatma hatası:', error);
    process.exit(1);
  }
}

initApplication();

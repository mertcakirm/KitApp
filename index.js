require('dotenv').config();

const _context = require('./src/context/AppDbContext'); 
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

async function initApplication() {
  try {
    await _context.sequelize.sync();
    console.log('AppDbContext: Veritabanı ve tablolar başarıyla senkronize edildi.');

    app.listen(PORT, () => {
      console.log(`Sunucu aktif: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Uygulama başlatma hatası:', error);
  }
}

initApplication();

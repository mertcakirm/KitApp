// server.js
require('dotenv').config();
const http = require('http'); // HTTPS yerine doğrudan güvenli ve yerelde sorunsuz HTTP kullanıyoruz

const _context = require('./src/context/AppDbContext'); 
const app = require('./src/app');
const seedDatabase = require('./src/config/seed');

// .env dosyasından gelen portu, yoksa varsayılan 3000'i kullanır
const PORT = process.env.PORT || 3000; 

async function initApplication() {
  try {
    // 1. Veritabanı tablolarını senkronize et
    await _context.sequelize.sync();
    console.log('AppDbContext: Veritabanı ve tablolar başarıyla senkronize edildi.');
    
    // 2. Başlangıç verilerini (seed) veritabanına yükle
    await seedDatabase(_context);
    
    // 3. HTTP sunucusunu express 'app' nesnesi ile oluştur
    const httpServer = http.createServer(app);

    // 4. Docker dışından (localhost:5173'ten) erişilebilmesi için '0.0.0.0' arayüzüyle dinle
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`HTTP Sunucu aktif: http://localhost:${PORT}`);
      console.log(`Docker dışından erişim adresi: http://127.0.0.1:${PORT}`);
    });
    
  } catch (error) {
    console.error('Uygulama başlatma hatası:', error);
    process.exit(1); // Kritik bir veritabanı veya sunucu hatasında süreci durdur
  }
}

// Uygulamayı başlat
initApplication();

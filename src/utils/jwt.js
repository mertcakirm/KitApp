const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error('JWT_SECRET ortam değişkeni tanımlı değil. Proje kökündeki .env dosyasına ekleyin.');
  }

  return secret;
};

const signToken = (payload) => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

const verifyRole = (token, requiredRole) => {
  const decoded = verifyToken(token);

  if (decoded.role !== requiredRole) {
    const error = new Error('Yetkisiz erişim.');
    error.statusCode = 403;
    throw error;
  }

  // Token içine koyduğunuz isimlendirmeye göre (id veya userId) döner
  const userId = decoded.id ?? decoded.sub;

  if (!userId) {
    const error = new Error('Token içeriğinde kullanıcı ID bulunamadı.');
    error.statusCode = 400;
    throw error;
  }

  return userId;
};

module.exports = { 
  signToken, 
  verifyToken, 
  verifyRole, 
};

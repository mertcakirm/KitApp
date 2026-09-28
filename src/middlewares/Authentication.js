const { verifyToken } = require('../utils/jwt');

// 1. Token doğrulama ve kullanıcıyı (id, role vb.) req.user'a atama
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Erişim reddedildi: Token bulunamadı.' });
  }

  try {
    const decoded = verifyToken(token);
    
    req.user = {
      ...decoded,
      id: decoded.id ?? decoded.userId ?? decoded.sub,
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş token.' });
  }
};

// 2. Rol kontrolü middleware'i
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Yetkilendirme başarısız: Kullanıcı bulunamadı.' });
    }

    const userRole = req.user.roleName ? req.user.roleName.toLowerCase() : '';
    const normalizedRoles = roles.map(role => role.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Erişim yetkiniz bulunmamaktadır.' });
    }

    next();
  };
};


module.exports = {
  authenticateToken,
  requireRole,
};

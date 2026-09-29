const bcrypt = require('bcryptjs');

async function seedDatabase(context) {
  const Role = context.Roles; 
  const User = context.Users;

  try {
    const roleNames = ['admin', 'writer', 'user'];
    for (const name of roleNames) {
      await Role.findOrCreate({
        where: { name: name },
        defaults: { name: name }
      });
    }
    console.log('Roller kontrol edildi/oluşturuldu.');

    const adminRole = await Role.findOne({ where: { name: 'admin' } });

    if (adminRole) {
      const adminEmail = 'admin@gmail.com';
      const hashedPassword = await bcrypt.hash('test', 10);
      
      const [adminUser, created] = await User.findOrCreate({
        where: { email: adminEmail },
        defaults: {
          username: 'superadmin',
          email: adminEmail,
          password: hashedPassword,
          roleId: adminRole.id
        }
      });

      if (created) {
        console.log('Varsayılan admin kullanıcısı başarıyla oluşturuldu.');
      }
    }
  } catch (error) {
    console.error('Seed işlemi sırasında hata oluştu:', error);
  }
}

module.exports = seedDatabase;
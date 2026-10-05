const BaseRepository = require('../repositories/BaseRepository');

class CategoryRepository extends BaseRepository{
    constructor(){
        super('Categories');
    };

    async getAllCategories() {
        return await this.model.findAndCountAll({
        where: { isActive:true }
        });
    }

async deleteCategory(categoryId) {
  const category = await this.model.findOne({
    where: { id: categoryId }
  });

  if (!category) {
    const error = new Error('Kategori bulunamadı!');
    error.statusCode = 404;
    throw error;
  }

  await category.destroy();

  return { success: true, message: 'Kategori başarıyla silindi.' };
}

}

module.exports = CategoryRepository;
const BaseRepository = require('../repositories/BaseRepository');

class CategoryRepository extends BaseRepository{
    constructor(){
        super('Categories');
    };

    async deleteCategory(id) {
        const category = await this.model.findOne({
            where: { 
                id, 
                isActive: true 
            }
        });

        if (!category) {
            const error = new Error('Kategori bulunamadı!');
            error.statusCode = 404;
            throw error;
        }

        category.isActive = false;
        await category.save();

        return { success: true, message: 'Kategori başarıyla silindi.' };
    }

}

module.exports = CategoryRepository;
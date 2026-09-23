class CategoryService {
    
    constructor(categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    async getAll(){
        const categories = await this.categoryRepository.getAll();
        return categories;
    }

    async create(categoryName){
        const result = await this.categoryRepository.create({name:categoryName});
        return result;
    }

    async delete(categoryId){
        const result = await this.categoryRepository.deleteCategory(categoryId);
        return result;
    }
}

module.exports = CategoryService;
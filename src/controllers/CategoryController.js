const CategoryRepository = require('../repositories/CategoryRepository');
const CategoryService = require('../services/CategoryService');
const _context = require('../context/AppDbContext');

class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    getAll = async (req,res,next) => {
        try {
            const result = await this.categoryService.getAll();
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    create = async (req,res,next) =>{
        try {
            const {categoryName} = req.body;
            const result = await this.categoryService.create(categoryName);
            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    delete = async (req,res,next) => {
        try {
            const { id } = req.param;
            const result = await this.categoryService.delete(id);
            return res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }

}


const categoryRepository = new CategoryRepository( _context );
const categoryService = new CategoryService( categoryRepository );

module.exports = new CategoryController( categoryService );

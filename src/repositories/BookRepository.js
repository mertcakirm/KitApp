const BaseRepository = require('./BaseRepository');
const { Op } = require('sequelize');

class BookRepository extends BaseRepository {

    constructor(){
        super('Books');
    }

   async getAllBooks(pageNum = 1, limit = 10, isAdmin = false, search = '') {
    const page = Math.max(1, parseInt(pageNum, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (page - 1) * pageSize;

    const bookWhere = {};
    if (!isAdmin) {
        bookWhere.isActive = true;
    }

    if (search) {
        const categoryMatch = { name: { [Op.like]: `%${search}%` } };
        if (!isAdmin) {
        categoryMatch.isActive = true;
        }

        const matchedBooks = await this.model.findAll({
        attributes: ['id'],
        include: [
            {
            association: 'categories',
            attributes: [],
            through: { attributes: [] },
            required: true,
            where: categoryMatch
            }
        ],
        raw: true
        });

        bookWhere[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { id: { [Op.in]: matchedBooks.map((b) => b.id) } }
        ];
    }

    const uploaderWhere = {};
    if (!isAdmin) {
        uploaderWhere.isActive = true;
    }

    const categoryWhere = {};
    if (!isAdmin) {
        categoryWhere.isActive = true;
    }

    const { count, rows } = await this.model.findAndCountAll({
        where: bookWhere,
        attributes: {
        exclude: isAdmin ? ['userId'] : ['userId', 'isActive']
        },
        include: [
        {
            association: 'uploader',
            attributes: ['id', 'username'],
            required: false,
            where: Object.keys(uploaderWhere).length > 0 ? uploaderWhere : undefined
        },
        {
            association: 'categories',
            attributes: ['id', 'name'],
            through: { attributes: [] },
            required: false,
            where: Object.keys(categoryWhere).length > 0 ? categoryWhere : undefined
        }
        ],
        limit: pageSize,
        offset: offset,
        distinct: true
    });

    return {
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
        books: rows
    };
  }

  async getAllBooksByUserId(userId, pageNum = 1, limit = 10, search = '') {
    const page = Math.max(1, parseInt(pageNum, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (page - 1) * pageSize;

    const whereCondition = { 
        isActive: true, 
        userId: userId 
    };

    if (search && search.trim() !== '') {
        const searchTerm = `%${search.trim()}%`;
        whereCondition[Op.or] = [
            { title: { [Op.like]: searchTerm } },
            { author: { [Op.like]: searchTerm } }
        ];
    }

    const { count, rows } = await this.model.findAndCountAll({
        where: whereCondition,
        attributes: { 
            exclude: ['isActive'] 
        },
        include: [
            {
                association: 'uploader',
                attributes: ['id', 'username'],
                required: false,
                where: { isActive: true }
            },
            {
                association: 'categories',
                attributes: ['id', 'name'],
                through: { attributes: [] },
                required: false,
                where: { isActive: true }
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: pageSize,
        offset: offset,
        distinct: true
    });

    return {
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
        books: rows
    };
}

    async deleteBook(bookId) {
        const book = await this.model.findByPk(bookId);

        if (!book) {
            const error = new Error("Kitap bulunamadı.");
            error.statusCode = 404;
            throw error;
        }

        if (!book.isActive) {
            return { success: false, message: "Kitap zaten pasif durumda.", bookId };
        }

        book.isActive = false;
        await book.save();

        return { success: true, message: "Kitap başarıyla pasife alındı.", bookId };
    }

    async updateBook(bookId, title, description, coverImage) {
        const book = await this.model.findByPk(bookId);

        if (!book) {
            const error = new Error("Kitap bulunamadı.");
            error.statusCode = 404;
            throw error;
        }

        if (title !== undefined) book.title = title;
        if (description !== undefined) book.description = description;
        if (coverImage !== undefined) book.coverImage = coverImage;

        await book.save();

        return {
            success: true,
            message: "Kitap başarıyla güncellendi.",
            book
        };
    }

    async verifyBook(bookId){
        const book = await this.model.findByPk(bookId);
        if (!book) {
            const error = new Error("Kitap bulunamadı.");
            error.statusCode = 404;
            throw error;
        }

        book.isVerified=true;
        await book.save();

        const verifiedCount = await this.model.count({
            where: { userId: book.userId, isVerified: true }
        });
        return {
            success: true,
            message: "Kitap başarıyla doğrulandı.",
            verifiedCount:verifiedCount
        };
    }

    async unVerifyBook(bookId){
        const book = await this.model.findByPk(bookId);
        if (!book) {
            const error = new Error("Kitap bulunamadı.");
            error.statusCode = 404;
            throw error;
        }
        book.isVerified=false;
        await book.save();

        const verifiedCount = await this.model.count({
            where: { userId: book.userId, isVerified: true }
        });
        return {
            success: true,
            message: "Kitap doğrulaması kaldırıldı.",
            verifiedCount:verifiedCount
        };
    }
}

module.exports = BookRepository;

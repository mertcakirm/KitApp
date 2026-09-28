const { where } = require('sequelize');
const BaseRepository = require('./BaseRepository');

class BookRepository extends BaseRepository {

    constructor(){
        super('Books');
    }

    async getAllBooks(pageNum = 1, limit = 10, isAdmin = false) {
        const page = Math.max(1, parseInt(pageNum, 10));
        const pageSize = Math.max(1, parseInt(limit, 10));
        const offset = (page - 1) * pageSize;

        const bookWhere = {};
        if (!isAdmin) {
        bookWhere.isActive = true;
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
            attributes: ['id', 'username', 'isActive'],
            required: false,
            where: Object.keys(uploaderWhere).length > 0 ? uploaderWhere : undefined
            },
            {
            association: 'categories',
            attributes: ['id', 'name','isActive'],
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



    async getAllBooksByUserId(userId, pageNum = 1, limit = 10) {
        const page = Math.max(1, parseInt(pageNum, 10));
        const pageSize = Math.max(1, parseInt(limit, 10));
        const offset = (page - 1) * pageSize;

        const { count, rows } = await this.model.findAndCountAll({
            where: { 
                isActive: true, 
                userId: userId 
            },
            attributes: { 
                exclude: ["isActive"] 
            },
            include: [
                {
                    association: 'categories',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                    required: false,
                    where: { isActive: true }
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



}

module.exports = BookRepository;

const { where } = require('sequelize');
const BaseRepository = require('./BaseRepository');

class BookRepository extends BaseRepository {

    constructor(){
        super('Books');
    }

    async getAllBooks(pageNum = 1, limit = 10) {
        const page = Math.max(1, parseInt(pageNum, 10));
        const pageSize = Math.max(1, parseInt(limit, 10));
        const offset = (page - 1) * pageSize;

        const { count, rows } = await this.model.findAndCountAll({
            where: { isActive: true }, // Kitabın kendi aktiflik kontrolü
            attributes: { 
                exclude: ['userId', "isActive"] 
            },
            include: [
                {
                    association: 'uploader',
                    attributes: ['id', 'username'],
                    required: false, // Uploader join'ini zorunlu kılmamak için
                    where: { isActive: true } // Sadece aktif uploader bilgilerini getir
                },
                {
                    association: 'categories',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                    required: false, // Kategori join'ini zorunlu kılmamak için
                    where: { isActive: true } // Sadece aktif kategorileri getir
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

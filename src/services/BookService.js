class BookService{

    constructor(userRepository, bookRepository){
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    async createBook(userId, data, categoryIds = []) {
        const user = await this.userRepository.getById(userId);
        if (!user) {
            const error = new Error('Kullanıcı bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        const bookPayload = {
            ...data,
            userId: userId
        };
        const newBook = await this.bookRepository.create(bookPayload);

        for (const categoryId of categoryIds) {
            await newBook.addCategory(categoryId);
        }

        await this.userRepository.increaseBookCount(userId);

        return newBook;
    }

    async getAllBooks(pageNum, limit) {
        const page = pageNum || 1;
        const pageSize = limit || 10;

        const result = await this.bookRepository.getAllBooks(page, pageSize);
        if (!result || result===null) {
            const error = new Error('Kullanıcı bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        return {
            success: true,
            message: 'Kitaplar başarıyla getirildi.',
            data: result
        };
        };

    async getAllBooksByUserId(userId , pageNum , limit) {

        const user = await this.userRepository.getById(userId);
        if (!user) {
            const error = new Error('Kullanıcı bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        const page = pageNum || 1;
        const pageSize = limit || 10;

        const result = await this.bookRepository.getAllBooksByUserId(userId,page, pageSize);
        
        if (!result || result===null) {
            const error = new Error('Kullanıcı bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        return {
            success: true,
            message: 'Kitaplar başarıyla getirildi.',
            data: result
        };
    };

    async deleteBook(userId, bookId) {
        const user = await this.userRepository.getById(userId);
        if (!user) {
            const error = new Error('Kullanıcı bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        const book = await this.bookRepository.getById(bookId);
        if (book.userId !== userId) {
            const error = new Error('Bu kitabı silme yetkiniz yok.');
            error.statusCode = 403;
            throw error;
        }

        const result = await this.bookRepository.deleteBook(bookId);

        if (result.success) {
            await this.userRepository.decreaseBookCount(userId);
        }

        return result;
    }


    async updateBook(userId, bookId, title, description, coverImage) {
        const user = await this.userRepository.getById(userId);
        if (!user) {
            const error = new Error('Kullanıcı bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        const book = await this.bookRepository.getById(bookId);
        if (!book) {
            const error = new Error('Kitap bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        if (book.userId !== userId) {
            const error = new Error('Bu kitabı güncelleme yetkiniz yok.');
            error.statusCode = 403; 
            throw error;
        }

        const result = await this.bookRepository.updateBook(bookId, title, description, coverImage);

        return result;
    }

}

module.exports = BookService;

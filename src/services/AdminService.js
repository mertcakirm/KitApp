class AdminService{
    constructor(userRepository,bookRepository){
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    async getAllUsers(page,limit){
        return await this.userRepository.getAllUsers(page,limit);
    }

    async getAllBooks(page,limit){
        return await this.bookRepository.getAllBooks(page,limit,true);
    }

    async deleteBook(bookId) {
        const book = await this.bookRepository.getById(bookId);
        if (!book.userId) {
            const error = new Error('Bu kitabı silme yetkiniz yok.');
            error.statusCode = 403;
            throw error;
        }

        const user = await this.userRepository.getById(book.userId);
        if (!user) {
            const error = new Error('Kullanıcı bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        const result = await this.bookRepository.deleteBook(bookId);

        if (result.success) {
            await this.userRepository.decreaseBookCount(book.userId);
        }
        return result;
    }

}


module.exports = AdminService;
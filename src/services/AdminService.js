class AdminService{
    constructor(userRepository,bookRepository){
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    async getAllUsers(pageNum,limit){
        const page = pageNum || 1;
        const pageSize = limit || 10;
        return await this.userRepository.getAllUsers(page,pageSize);
    }

    async getAllBooks(pageNum,limit,search){
        const page = pageNum || 1;
        const pageSize = limit || 10;
        
        return await this.bookRepository.getAllBooks(page,pageSize,true,search);
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



    async verifyBook(bookId) {
        const book = await this.bookRepository.getById(bookId);
        if (!book) {
            const error = new Error('Kitap bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        const userId = book.userId;
        
        const result = await this.bookRepository.verifyBook(bookId);

        let roleChanged = false;

        if (result.verifiedCount === 5) {
            const ischanged = await this.userRepository.updateRole(userId,'Writer'); 
            roleChanged = ischanged.success;
        }

        return {
            success: true,
            message: 'Kitap başarıyla doğrulandı.',
            verifiedCount: result.verifiedCount,
            roleChanged: roleChanged,
        };
    }

    async unverifyBook(bookId) {
        const book = await this.bookRepository.getById(bookId);
        if (!book) {
            const error = new Error('Kitap bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        const userId = book.userId;
        
        const result = await this.bookRepository.unVerifyBook(bookId);

        let roleChanged = false;

        if (result.verifiedCount === 4) {
            const ischanged = await this.userRepository.updateRole(userId,'User'); 
            roleChanged = roleChanged;
        }

        return {
            success: true,
            message: 'Kitap doğrulaması başarıyla kaldırıldı.',
            verifiedCount: result.verifiedCount,
            roleChanged: roleChanged,
        };
    }

}


module.exports = AdminService;
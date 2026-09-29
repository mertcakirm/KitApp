class UserService{

    constructor(userRepository,bookRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository
    }

    async getMyProfile(userId){
        const user = await this.userRepository.getMyInfo(userId)
        if (!user || user === null) {
            const error = new Error('Kullanıcı bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        return user;
    }

    async getAllWriters(pageNum = 1, limit = 10, search = '') {
        const result = await this.userRepository.getWriters(pageNum, limit, search);
        if (!result || result === null) {
            const error = new Error('Veri bulunamadı.');
            error.statusCode = 404;
            throw error;
        }
        return result;
    }

    async deleteUser(userId){
        const user = await this.userRepository.getMyInfo(userId)
        if (!user || user === null) {
            const error = new Error('Kullanıcı bulunamadı.');
            error.statusCode = 404;
            throw error;
        }

        if(userId !== user.id){
            const error = new Error(`Kullanıcı kimlikleri eşleşmiyor.`)
            error.statusCode = 403;
            throw error;           
        }

        const bookobj = await this.bookRepository.getAllBooksByUserId(userId,1,10000000);
        const bookList = bookobj.books;

        bookList.forEach(book => {
            this.bookRepository.deleteBook(book.id);
        });

        const result = await this.userRepository.deleteUser(userId);

        return result;
    }
   
}

module.exports = UserService;
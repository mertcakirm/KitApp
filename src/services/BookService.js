class BookService{

    constructor(userRepository, bookRepository){
        this.userRepository = userRepository;
        this.bookRepository = bookRepository
    }

async createBook(userId, data) {
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

    await this.userRepository.increaseBookCount(userId);

    return newBook;
}

}

module.exports = BookService;
const BaseRepository = require('./BaseRepository');

class BookRepository extends BaseRepository {

    constructor(){
        super('Books');
    }


}

module.exports = BookRepository;
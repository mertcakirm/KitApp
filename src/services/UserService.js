const UserResponseDto = require('../DTOs/UserDTO');

class UserService{

    constructor(userRepository) {
        this.userRepository = userRepository;
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
   
}

module.exports = UserService;
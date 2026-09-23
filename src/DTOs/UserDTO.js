class UserInfoResponseDto {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.bookCount = user.bookCount;
    this.roleId = user.roleId;
    this.createdAt = user.createdAt;
    
    if (user.role) {
      this.role = user.role;
    }
    if (user.books) {
      this.books = user.books;
    }
  }
}

module.exports = UserInfoResponseDto;



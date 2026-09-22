const registerUserResponse = {
  id: newUser.id,
  email: newUser.email,
  username: newUser.username,
  roleId: newUser.roleId,
};

return { user: registerUserResponse, token };
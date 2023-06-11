using Todo.API.Dto;
using Todo.API.Dto.Responses;

namespace Todo.API.Services.Users;

public interface IUserService
{
    Task<LoginResponse> Login(UserLoginRequest userLoginRequest);
}
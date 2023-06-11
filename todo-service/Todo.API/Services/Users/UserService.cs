using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Todo.API.Dto;
using Todo.API.Dto.Responses;
using Todo.API.IRepository;

namespace Todo.API.Services.Users;

public class UserService : IUserService
{
    private readonly IConfiguration _config;
    private readonly IUserRepository _userRepository;

    public UserService(IConfiguration config, IUserRepository user)
    {
        _config = config;
        _userRepository = user;
    }

    public async Task<LoginResponse> Login(UserLoginRequest userLoginRequest)
    {
        var user = await _userRepository.Authenticate(userLoginRequest.Username, userLoginRequest.Password);

        if (user == null) throw new Exception("User is not valid");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        };

        var jwtSettings = _config["JWTSetting:Key"] ?? string.Empty;
        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddDays(Convert.ToDouble(_config["JWTSetting:ExpireDays"]));

        var token = new JwtSecurityToken(
            issuer: _config["JWTSetting:Issuer"],
            audience: _config["JWTSetting:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds);

        return new LoginResponse { Token = new JwtSecurityTokenHandler().WriteToken(token) };
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Todo.API.Dto;
using Todo.API.IRepository;

namespace Todo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IdentityController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IUserRepository _user;

        public IdentityController(IConfiguration config, IUserRepository user)
        {
            _config = config;
            _user = user;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginRequest userLoginRequest)
        {
            var user = await _user.Authenticate(userLoginRequest.Username, userLoginRequest.Password);

            if (user == null) return Unauthorized();

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

            return Ok(new JwtSecurityTokenHandler().WriteToken(token));
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Todo.API.Dto;
using Todo.API.Dto.Responses;
using Todo.API.IRepository;
using Todo.API.Services.Users;

namespace Todo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IdentityController : ControllerBase
    {
        private readonly IUserService _userService;

        public IdentityController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(UserLoginRequest userLoginRequest)
        {
            try
            {
                var response = await _userService.Login(userLoginRequest);

                return Ok(response);
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
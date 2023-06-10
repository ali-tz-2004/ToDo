using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Todo.API.Data;
using Todo.API.Dto;
using Todo.API.IRepository;
using Todo.API.Model;

namespace Todo.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class UserController : ControllerBase
{
    private readonly TodoDbContext _db;
    private readonly IMapper _mapper;
    private readonly IUserRepository _userRepository;

    public UserController(TodoDbContext db, IMapper mapper, IUserRepository userRepository)
    {
        _db = db;
        _mapper = mapper;
        _userRepository = userRepository;
    }

    [HttpGet]
    public async Task<List<UserResponse>> GetAll([FromHeader] string? username)
    {
        var allUsers = await _userRepository.GetAllAsync();
        try
        {
            var user = allUsers.Where(u => u.Username == username || u.Email == username);

            return _mapper.Map<List<UserResponse>>(user);
        }
        catch (System.Exception)
        {
            return _mapper.Map<List<UserResponse>>(allUsers);
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponse>> GetById(string id)
    {
        var todo = await _userRepository.GetById(id);

        if (todo == null)
        {
            return NotFound();
        }

        return _mapper.Map<UserResponse>(todo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _userRepository.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost]
    public async Task<IActionResult> Create(UserResponse userResponse)
    {
        var user = _mapper.Map<User>(userResponse);

        await _userRepository.AddAsync(user);

        var createdUserResponse = _mapper.Map<UserResponse>(user);

        return Created($"/userItems/{createdUserResponse.Id}", createdUserResponse);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UserResponse userResponse)
    {
        var user = _mapper.Map<User>(userResponse);

        await _userRepository.UpdateAsync(user);

        return NoContent();
    }
}
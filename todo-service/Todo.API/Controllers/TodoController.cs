using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Todo.API.Data;
using Todo.API.Dto;
using Todo.API.IRepository;

namespace Todo.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class TodoController : ControllerBase
{
    private readonly TodoDb _db;
    private readonly IMapper _mapper;
    private readonly ITodoRepository _todoRepository;

    public TodoController(TodoDb db, IMapper mapper, ITodoRepository todoRepository)
    {
        _db = db;
        _mapper = mapper;
        _todoRepository = todoRepository;
    }

    [HttpGet]
    public async Task<IEnumerable<TodoResponse>> GetUnCompleteTodos()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) throw new Exception("User not found");

        var allTodo = await _todoRepository.GetAllAsync();
        var unCompletedTodos = allTodo.Where(t => !t.IsComplete && t.UserId == Guid.Parse(userId))
                           .OrderByDescending(x => x.CreatedAt);

        return _mapper.Map<List<TodoResponse>>(unCompletedTodos);
    }

    [HttpGet("complete")]
    public async Task<IEnumerable<TodoResponse>> GetInCompleteTodos()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) throw new Exception("User not found");

        var allTodo = await _todoRepository.GetAllAsync();
        var todos = allTodo.Where(t => t.IsComplete && t.UserId == Guid.Parse(userId)).OrderByDescending(x => x.CompleteDate);

        return _mapper.Map<List<TodoResponse>>(todos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoResponse>> GetById(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) throw new Exception("User not found");

        var todo = await _todoRepository.GetByIdAsync(id);
        if (todo == null || todo.UserId != Guid.Parse(userId))
        {
            return NotFound();
        }

        return _mapper.Map<TodoResponse>(todo);
    }

    [HttpPost]
    public async Task<IActionResult> Create(TodoRequest todoRequest)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var todo = _mapper.Map<API.Model.Todo>(todoRequest);
        todo.UserId = Guid.Parse(userId);

        await _todoRepository.AddAsync(todo);

        var createdTodoResponse = _mapper.Map<TodoResponse>(todo);

        return Created($"/todoItems/{createdTodoResponse.Id}", createdTodoResponse);
    }

    [HttpPut]
    public async Task<IActionResult> Update(TodoRequest inputTodo)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var todo = _mapper.Map<Model.Todo>(inputTodo);

        var todoId = await _todoRepository.GetByIdAsync(inputTodo.Id.ToString());
        if (todoId == null || todoId.UserId != Guid.Parse(userId))
        {
            return NotFound();
        }

        await _todoRepository.UpdateAsync(todo);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) throw new Exception("User not found");

        var todo = await _todoRepository.GetByIdAsync(id);
        if (todo == null || todo.UserId != Guid.Parse(userId))
        {
            return NotFound();
        }

        await _todoRepository.DeleteAsync(id);

        return NoContent();
    }

    [HttpPut("{id}/complete")]
    public async Task<IActionResult> ToggleComplete(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) throw new Exception("User not found");

        var todo = await _todoRepository.GetByIdAsync(id);
        if (todo == null || todo.UserId != Guid.Parse(userId))
        {
            return NotFound();
        }

        await _todoRepository.UpdateCompleteAsync(id);

        return NoContent();
    }
}
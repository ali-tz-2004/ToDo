using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Todo.API.Data;
using Todo.API.Dto;
using Todo.API.IRepository;

namespace Todo.API.Controllers;

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
    public async Task<IEnumerable<TodoDto>> GetUnCompleteTodos()
    {
        var allTodo = await _todoRepository.GetAllAsync();
        var unCompletedTodos = allTodo.Where(x => !x.IsComplete)
                           .OrderByDescending(x => x.CreatedAt);

        return _mapper.Map<List<TodoDto>>(unCompletedTodos);
    }

    [HttpGet("complete")]
    public async Task<IEnumerable<TodoDto>> GetInCompleteTodos()
    {
        var allTodo = await _todoRepository.GetAllAsync();
        var todos = allTodo.Where(t => t.IsComplete).OrderByDescending(x => x.CompleteDate);
        return _mapper.Map<List<TodoDto>>(todos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoDto>> GetById(string id)
    {
        var todo = await _todoRepository.GetByIdAsync(id);

        if (todo == null)
        {
            return NotFound();
        }

        return _mapper.Map<TodoDto>(todo);
    }

    [HttpPost]
    public async Task<IActionResult> Create(TodoDto todoDto)
    {
        var todo = _mapper.Map<API.Model.Todo>(todoDto);

        await _todoRepository.AddAsync(todo);

        var createdTodoDto = _mapper.Map<TodoDto>(todo);

        return Created($"/todoItems/{createdTodoDto.Id}", createdTodoDto);
    }

    [HttpPut]
    public async Task<IActionResult> Update(TodoDto inputTodo)
    {
        var todo = _mapper.Map<Model.Todo>(inputTodo);

        await _todoRepository.UpdateAsync(todo);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(String id)
    {
        await _todoRepository.DeleteAsync(id);
        return NoContent();
    }

    [HttpPut("{id}/complete")]
    public async Task<IActionResult> ToggleComplete(string id)
    {
        await _todoRepository.UpdateCompleteAsync(id);
        return NoContent();
    }
}
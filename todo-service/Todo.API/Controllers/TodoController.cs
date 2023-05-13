using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]

public class TodoController : ControllerBase
{
    private readonly TodoDb _db;

    public TodoController(TodoDb db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IEnumerable<Todo>> GetUnCompleteTodos()
    {
        return await _db.Todos.Where(x => x.IsComplete == false).OrderByDescending(x => x.CreatedAt).ToListAsync();
    }

    [HttpGet("complete")]
    public async Task<IEnumerable<Todo>> GetInCompleteTodos()
    {
        return await _db.Todos.Where(t => t.IsComplete).OrderByDescending(x => x.CompleteDate).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        if (!Guid.TryParse(id, out Guid todoId))
        {
            return BadRequest();
        }

        var todo = await _db.Todos.FindAsync(todoId);

        if (todo == null)
        {
            return NotFound();
        }

        return Ok(todo);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Todo todo)
    {
        _db.Todos.Add(todo);
        await _db.SaveChangesAsync();

        // return CreatedAtAction(nameof(GetById), new { todo.Id }, todo);
        return Created($"/todoItems/{todo.Id}", todo);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Todo inputTodo)
    {
        var todo = await _db.Todos.FindAsync(Guid.Parse(id));

        if (todo is null) return NotFound();

        todo.Name = inputTodo.Name;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(String id)
    {
        if (await _db.Todos.FindAsync(Guid.Parse(id)) is Todo todo)
        {
            _db.Todos.Remove(todo);
            await _db.SaveChangesAsync();
            return Ok(todo);
        }

        return NotFound();
    }

    [HttpPut("{id}/complete")]
    public async Task<IActionResult> ToggleComplete(string id)
    {
        if (!Guid.TryParse(id, out Guid todoId))
        {
            return BadRequest();
        }

        var todo = await _db.Todos.FindAsync(todoId);

        if (todo == null)
        {
            return NotFound();
        }

        todo.IsComplete = !todo.IsComplete;
        todo.CompleteDate = DateTime.Now;

        await _db.SaveChangesAsync();

        return NoContent();
    }

}
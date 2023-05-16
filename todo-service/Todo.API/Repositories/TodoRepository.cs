using Microsoft.EntityFrameworkCore;
using Todo.API.Data;
using Todo.API.IRepository;

namespace Todo.API.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly TodoDb _context;

    public TodoRepository(TodoDb context)
    {
        _context = context;
    }

    public async Task<List<Model.Todo>> GetAllAsync()
    {
        return await _context.Todos.ToListAsync();
    }

    public async Task<Model.Todo> GetByIdAsync(string id)
    {
        var result = await _context.Todos.FindAsync(id);
        if (result == null) throw new Exception();
        return result;
    }

    public async Task AddAsync(Model.Todo todo)
    {
        await _context.AddAsync(todo);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(string id)
    {
        var todo = await _context.Todos.FindAsync(Guid.Parse(id));

        if (todo == null)
        {
            return;
        }

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();
    }


    public async Task UpdateAsync(Model.Todo todo)
    {
        if (todo == null)
        {
            throw new ArgumentNullException(nameof(todo));
        }

        var existingTodo = await _context.Todos.FindAsync(todo.Id);

        if (existingTodo == null)
        {
            return;
        }

        existingTodo.Name = todo.Name;

        await _context.SaveChangesAsync();
    }

    public async Task UpdateCompleteAsync(string id)
    {
        var todo = await _context.Todos.FindAsync(Guid.Parse(id));

        if (todo == null) return;

        todo.IsComplete = !todo.IsComplete;
        todo.CompleteDate = DateTime.Now;

        await _context.SaveChangesAsync();
    }
}
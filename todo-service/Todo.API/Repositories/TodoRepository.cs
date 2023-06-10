using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Todo.API.Data;
using Todo.API.IRepository;
using Todo.API.Model;

namespace Todo.API.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly TodoDbContext _context;

    public TodoRepository(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Model.Todo>> GetAllAsync()
    {
        return await _context.Todos.Include(t => t.User).ToListAsync();
    }

    public async Task<Model.Todo> GetByIdAsync(string id)
    {
        var result = await _context.Todos.FindAsync(Guid.Parse(id));
        if (result == null) throw new Exception("user id is not found");
        return result;
    }

    public async Task AddAsync(Model.Todo todo)
    {
        var user = await _context.Users.FindAsync(todo.UserId);
        if (user == null) throw new Exception("User not found");

        todo.Username = user.Username;

        await _context.Todos.AddAsync(todo);
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
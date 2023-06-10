using Microsoft.EntityFrameworkCore;
using Todo.API.Data;
using Todo.API.IRepository;
using Todo.API.Model;

namespace Todo.API.Repositories;

public class UserRepository : IUserRepository
{
    private readonly TodoDb _context;

    public UserRepository(TodoDb context)
    {
        _context = context;
    }

    public async Task AddAsync(User user)
    {
        await _context.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(string id)
    {
        var user = await _context.Users.FindAsync(Guid.Parse(id));

        if (user == null) return;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User> GetById(string id)
    {
        var result = await _context.Users.FindAsync(Guid.Parse(id));
        if (result == null) throw new Exception();
        return result;
    }

    public async Task<User> GetByUsernameAndPassword(string username, string password)
    {
        return await _context.Users.FirstOrDefaultAsync(u => (u.Username == username || u.Email == username) && u.Password == password)
            ?? throw new Exception($"User with username '{username}' not found.");
    }

    public async Task UpdateAsync(User user)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user));
        }

        var existingUser = await _context.Users.FindAsync(user.Id);

        if (existingUser == null)
        {
            return;
        }

        existingUser.Username = user.Username;
        existingUser.Email = user.Email;
        existingUser.Password = user.Password;

        await _context.SaveChangesAsync();
    }
    public Task<User> Authenticate(string username, string password)
    {
        var user = GetByUsernameAndPassword(username, password);

        if (user == null) throw new Exception("not fount user!");

        return user;
    }
}
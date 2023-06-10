using Todo.API.Model;

namespace Todo.API.IRepository;

public interface IUserRepository
{
    Task<List<User>> GetAllAsync();
    Task<User> GetById(string id);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(string id);
    Task<User> Authenticate(string username, string password);

}
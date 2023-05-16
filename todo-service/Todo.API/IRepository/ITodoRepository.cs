namespace Todo.API.IRepository;
public interface ITodoRepository
{
    Task<Model.Todo> GetByIdAsync(string id);
    Task<List<Model.Todo>> GetAllAsync();
    Task AddAsync(Model.Todo todo);
    Task UpdateAsync(Model.Todo todo);
    Task UpdateCompleteAsync(string id);
    Task DeleteAsync(string id);
}
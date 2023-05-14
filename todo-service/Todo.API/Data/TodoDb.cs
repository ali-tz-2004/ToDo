using Microsoft.EntityFrameworkCore;

namespace Todo.API.Data;
public class TodoDb : DbContext
{
    public TodoDb(DbContextOptions<TodoDb> options) : base(options) { }

    public DbSet<Todo.API.Model.Todo> Todos => Set<Todo.API.Model.Todo>();
}
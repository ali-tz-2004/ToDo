namespace Todo.API.Model;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public ICollection<Todo> Todos { get; set; } = new List<Todo>();
}
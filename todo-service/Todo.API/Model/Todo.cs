namespace Todo.API.Model;
public class Todo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Name { get; set; }
    public bool IsComplete { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime CompleteDate { get; set; }
    public string? Username { get; set; }
    public User User { get; set; } = null!;
    public Guid UserId { get; set; }
}
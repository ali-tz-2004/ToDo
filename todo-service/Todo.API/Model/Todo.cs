public class Todo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Name { get; set; }
}
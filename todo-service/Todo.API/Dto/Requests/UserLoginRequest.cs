namespace Todo.API.Dto;
public class UserLoginRequest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}
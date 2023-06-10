using Microsoft.EntityFrameworkCore;
using Todo.API.Model;

namespace Todo.API.Data;
public class TodoDbContext : DbContext
{
    public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options) { }

    public DbSet<Model.Todo> Todos => Set<Model.Todo>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Model.Todo>()
            .HasKey(t => t.Id);

        modelBuilder.Entity<Model.Todo>()
            .Property(t => t.Name)
            .HasMaxLength(80);

        modelBuilder.Entity<User>()
        .HasMany(e => e.Todos)
        .WithOne(e => e.User)
        .HasForeignKey(e => e.UserId)
        .HasPrincipalKey(e => e.Id);

        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<User>()
            .Property(u => u.Username)
            .HasMaxLength(60);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .Property(u => u.Email)
            .HasMaxLength(60);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

    }
}
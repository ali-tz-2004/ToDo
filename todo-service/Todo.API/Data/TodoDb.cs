using Microsoft.EntityFrameworkCore;
using Todo.API.Model;

namespace Todo.API.Data;
public class TodoDb : DbContext
{
    public TodoDb(DbContextOptions<TodoDb> options) : base(options) { }

    public DbSet<Model.Todo> Todos => Set<Model.Todo>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Model.Todo>()
            .HasKey(t => t.Id);

        modelBuilder.Entity<Model.Todo>()
            .Property(t => t.Name)
            .HasMaxLength(80);

        modelBuilder.Entity<Model.Todo>()
            .HasOne(t => t.Username)
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .IsRequired();

        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<User>()
            .Property(u => u.Username)
            .HasMaxLength(60);

        modelBuilder.Entity<User>()
            .Property(u => u.Email)
            .HasMaxLength(60);

        modelBuilder.Entity<User>()
            .Property(u => u.Password)
            .HasMaxLength(60);
    }
}
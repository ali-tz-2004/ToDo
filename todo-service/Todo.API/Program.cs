using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TodoDb>(opt => opt.UseInMemoryDatabase("TodoList"));
var app = builder.Build();

app.MapGet("/", () => "Hello World!");
app.MapGet("/todoItems", async (TodoDb db) =>
    await db.Todos.ToListAsync());

app.MapGet("/todoItems/{id}", async (string id, TodoDb db) =>
    await db.Todos.FindAsync(Guid.Parse(id))
        is Todo todo
            ? Results.Ok(todo)
            : Results.NotFound());

app.MapPost("/todoItems", async (Todo todo, TodoDb db) =>
{
    db.Todos.Add(todo);
    await db.SaveChangesAsync();

    return Results.Created($"/todoItems/{todo.Id}", todo);
});

app.MapPut("/todoItems/{id}", async (string id, Todo inputTodo, TodoDb db) =>
{
    var todo = await db.Todos.FindAsync(Guid.Parse(id));

    if (todo is null) return Results.NotFound();

    todo.Name = inputTodo.Name;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/todoItems/{id}", async (string id, TodoDb db) =>
{
    if (await db.Todos.FindAsync(Guid.Parse(id)) is Todo todo)
    {
        db.Todos.Remove(todo);
        await db.SaveChangesAsync();
        return Results.Ok(todo);
    }

    return Results.NotFound();
});


app.Run();

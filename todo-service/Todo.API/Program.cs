using Microsoft.EntityFrameworkCore;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.AllowAnyOrigin();
                          policy.AllowAnyHeader();
                          policy.AllowAnyMethod();
                          policy.WithOrigins("http://localhost:3000");
                      });
});

builder.Services.AddDbContext<TodoDb>(opt => opt.UseInMemoryDatabase("TodoList"));

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

app.MapGet("/todoItems", async (TodoDb db) =>
    await db.Todos.OrderByDescending(x => x.CreatedAt).ToListAsync());

app.MapGet("/todoItems/complete", async (TodoDb db) =>
    await db.Todos.Where(t => t.IsComplete).ToListAsync());

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

app.MapPut("/todoItems/{id}/complete", async (string id, TodoDb db) =>
{
    var todo = await db.Todos.FindAsync(Guid.Parse(id));

    if (todo is null) return Results.NotFound();

    todo.IsComplete = !todo.IsComplete;

    await db.SaveChangesAsync();

    return Results.NoContent();
});


app.Run();

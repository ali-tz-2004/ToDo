using Microsoft.EntityFrameworkCore;
using Todo.API.Data;

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

builder.Services.AddDbContext<TodoDb>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers();

var app = builder.Build();

app.UseRouting();
app.UseCors(MyAllowSpecificOrigins); // enable CORS
app.UseAuthorization();
app.MapControllers();

app.Run();

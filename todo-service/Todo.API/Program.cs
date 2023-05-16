using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Todo.API.Data;
using Todo.API.IRepository;
using Todo.API.Mapper;
using Todo.API.Repositories;

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


var mapperConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new AutoMapperConfig());
});

IMapper mapper = mapperConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

builder.Services.AddScoped<ITodoRepository, TodoRepository>();


var app = builder.Build();

app.UseRouting();
app.UseCors(MyAllowSpecificOrigins); // enable CORS
app.UseAuthorization();
app.MapControllers();

app.Run();

using AutoMapper;
using Todo.API.Dto;
using Todo.API.Model;

namespace Todo.API.Mapper;

public class AutoMapperConfig : Profile
{
    public AutoMapperConfig()
    {
        CreateMap<Model.Todo, TodoResponse>().ReverseMap();
        CreateMap<User, UserResponse>().ReverseMap();
    }
}
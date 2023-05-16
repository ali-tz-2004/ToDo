using AutoMapper;
using Todo.API.Dto;

namespace Todo.API.Mapper;

public class AutoMapperConfig : Profile
{
    public AutoMapperConfig()
    {
        CreateMap<Model.Todo, TodoDto>().ReverseMap();
    }
}
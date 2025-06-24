using App.Dto_s.ProgressDtos;
using AutoMapper;
using Domain.Entities;

namespace App.Mapper;

public class ProgressProfile : Profile
{
    public ProgressProfile()
    {
        CreateMap<ProgressDto, Progress>()
            .ReverseMap();
    }
}

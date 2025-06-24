using App.Dto_s.RoadmapDto;
using AutoMapper;
using Domain.Entities;

namespace Application.MappingProfiles;

public class RoadmapProfile : Profile
{
    public RoadmapProfile()
    {
        CreateMap<Roadmap, RoadmapDto>()
            .ForMember(dest => dest.Tasks, opt => opt.MapFrom(src => src.RoadmapTasks));

        CreateMap<RoadmapTask, RoadmapTaskDto>()
            .ForMember(dest => dest.Icon, opt => opt.MapFrom(src => src.Icon))
            .ForMember(dest => dest.Locked, opt => opt.MapFrom(src => src.Locked));
    }
}

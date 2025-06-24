using App.Dto_s;
using AutoMapper;
using Domain.Entities;
using System.Buffers.Text;

namespace App.Mapper
{
    public class DesignTaskProfile : Profile
    {
        public DesignTaskProfile()
        {
            CreateMap<DesignTask, DesignTaskDtoRes>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Level, opt => opt.MapFrom(src => src.Level))
                .ForMember(dest => dest.Programming_Language, opt => opt.MapFrom(src => src.ProgrammingLanguage))
                .ForMember(dest => dest.Designs, opt => opt.MapFrom(src => src.Designs.Select(d => $"{d.ImageUrl}").ToList()))
                .ForMember(dest => dest.InstructorId, opt => opt.MapFrom(src => src.InstructorId))
                .ReverseMap();


            CreateMap<DesignTaskDtoReq, DesignTask>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Level, opt => opt.MapFrom(src => src.Level))
                .ForMember(dest => dest.ProgrammingLanguage, opt => opt.MapFrom(src => src.Programming_Language))
                .ForMember(dest => dest.InstructorId, opt => opt.Ignore())
                .ReverseMap();
        }
    }
}
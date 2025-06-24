using App.Dto_s.TaskDto;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Mapper
{
    public class OptimalTaskSolutionProfile : Profile
    {
        public OptimalTaskSolutionProfile() 
        {
            CreateMap<OptimalTaskSolutionDto, OptimalTaskSolution>()
                .ForMember(dest => dest.HTML, opt => opt.MapFrom(src => src.HTML))
                .ForMember(dest => dest.CSS, opt => opt.MapFrom(src => src.CSS))
                .ForMember(dest => dest.JavaScript, opt => opt.MapFrom(src => src.JS))
                .ForMember(dest => dest.React, opt => opt.MapFrom(src => src.React))
                .ReverseMap();
        }
    }
}

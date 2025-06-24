using App.Dto_s;
using App.Dto_s.LearnerAuthDto;
using AutoMapper;
using Domain.Entities;

/// <summary>
/// Example of using AutoMapper to map between User and UserDto
namespace App.Mapper;
public class LearnerProfile:Profile
{
    public LearnerProfile()
    {
        CreateMap<LearnerReqDto, Learner>()
    .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
    .ForMember(dest => dest.CanCreateTask, opt => opt.MapFrom(src => src.CanCreateTask))
    .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
    .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.Password))
    .ForMember(dest => dest.Provider, opt => opt.Ignore())
    .ForMember(dest => dest.ProviderId, opt => opt.Ignore())
    .ForMember(dest => dest.ProfileImageUrl, opt => opt.Ignore())
    .ForMember(dest => dest.Id, opt => opt.Ignore())
    .ForMember(dest => dest.RefreshToken, opt => opt.Ignore())
    .ForMember(dest => dest.RefreshTokenExpiryTime, opt => opt.Ignore())
    .ForMember(dest => dest.CreatedTasks, opt => opt.Ignore())
    .ForMember(dest => dest.Progresses, opt => opt.Ignore())
    .ReverseMap();

        CreateMap<LearnerResDto, Learner>()
    .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
    .ForMember(dest => dest.CanCreateTask, opt => opt.MapFrom(src => src.CanCreateTask))
    .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
    .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
    .ForMember(dest => dest.Provider, opt => opt.Ignore())
    .ForMember(dest => dest.ProviderId, opt => opt.Ignore())
    .ForMember(dest => dest.ProfileImageUrl, opt => opt.Ignore())
    .ForMember(dest => dest.Id, opt => opt.Ignore())
    .ForMember(dest => dest.RefreshToken, opt => opt.Ignore())
    .ForMember(dest => dest.RefreshTokenExpiryTime, opt => opt.Ignore())
    .ForMember(dest => dest.CreatedTasks, opt => opt.Ignore())
    .ForMember(dest => dest.Progresses, opt => opt.Ignore())
    .ReverseMap();

        CreateMap<ExternalUserDto, Learner>()
          .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Name)) 
          .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())              
          .ForMember(dest => dest.CanCreateTask, opt => opt.MapFrom(src => false)) 
          .ForMember(dest => dest.Provider, opt => opt.MapFrom(src => src.Provider))
          .ForMember(dest => dest.ProviderId, opt => opt.MapFrom(src => src.ProviderId))
          .ForMember(dest => dest.ProfileImageUrl, opt => opt.MapFrom(src => src.ProfileImage))
          .ForMember(dest => dest.Id, opt => opt.Ignore()) 
          .ForMember(dest => dest.RefreshToken, opt => opt.Ignore())
          .ForMember(dest => dest.RefreshTokenExpiryTime, opt => opt.Ignore())
          .ForMember(dest => dest.CreatedTasks, opt => opt.Ignore())
          .ForMember(dest => dest.Progresses, opt => opt.Ignore());

        CreateMap<ProfilePictureDto,Learner>()
            .ForMember(dest => dest.ProfileImageUrl, opt => opt.MapFrom(src => src.ImageUrl))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src=>src.Id))
            .ForMember(dest => dest.Email, opt => opt.Ignore())
            .ForMember(dest => dest.Username, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.CanCreateTask, opt => opt.Ignore())
            .ForMember(dest => dest.Provider, opt => opt.Ignore())
            .ForMember(dest => dest.ProviderId, opt => opt.Ignore())
            .ForMember(dest => dest.RefreshToken, opt => opt.Ignore())
            .ForMember(dest => dest.RefreshTokenExpiryTime, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedTasks, opt => opt.Ignore())
            .ForMember(dest => dest.Progresses, opt => opt.Ignore())
            .ReverseMap();
    }

    
}

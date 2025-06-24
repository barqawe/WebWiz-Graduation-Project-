using App.Dto_s.ProgressDtos;
using App.Dto_s.RoadmapDto;
using App.Dto_s.TaskDto;
using App.Repository;
using AutoMapper;
using Domain.Entities;
using Infrastructure.DataHandler;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository;

public class RoadmapRepository : IRoadmapRepository
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public RoadmapRepository(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public async Task<List<RoadmapDto>> GetAllRoadmapsAsync()
    {
        List<RoadmapDto> roadmaps = await _context.Roadmaps
           .AsNoTracking()
           .AsSplitQuery()
           .Select(r => new RoadmapDto
           {
               Id = r.Id,
               Title = r.Title,
               Description = r.Description,
               Subtitle = r.Subtitle,
               Color = r.Color,
               Icon = r.Icon,
               Tasks = r.RoadmapTasks.OrderBy(rt => rt.Id).Select(rt => new RoadmapTaskDto
               {
                   Id = rt.Id,
                   Icon = rt.Icon,
                   Locked = true,
                   DesignTaskDto = rt.DesignTask == null ? null : new DesignTaskDto
                   {
                       Id = rt.DesignTask.Id,
                       Name = rt.DesignTask.Name,
                       Description = rt.DesignTask.Description,
                       Level = rt.DesignTask.Level,
                       ProgrammingLanguage = rt.DesignTask.ProgrammingLanguage
                   }
               }).ToList()
           })
           .ToListAsync();

        return roadmaps;
    }
    public async Task<RoadmapDto?> GetRoadmapByIdAsync(int id)
    {
        RoadmapDto? roadmap = await _context.Roadmaps
            .AsNoTracking()
            .AsSplitQuery()
            .Where(r => r.Id == id)
            .Select(r => new RoadmapDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                Subtitle = r.Subtitle,
                Color = r.Color,
                Icon = r.Icon,
                Tasks = r.RoadmapTasks.OrderBy(rt => rt.Id).Select(rt => new RoadmapTaskDto
                {
                    Id = rt.Id,
                    Icon = rt.Icon,
                    Locked = true,
                    DesignTaskDto = rt.DesignTask == null ? null : new DesignTaskDto
                    {
                        Id = rt.DesignTask.Id,
                        Name = rt.DesignTask.Name,
                        Description = rt.DesignTask.Description,
                        Level = rt.DesignTask.Level,
                        ProgrammingLanguage = rt.DesignTask.ProgrammingLanguage
                    }
                }).ToList()
            })
            .FirstOrDefaultAsync();

        return roadmap;
    }
    public async Task<List<RoadmapDto>> GetAllRoadmapsWithProgressAsync(Guid learnerId)
    {
        var roadmaps = await _context.Roadmaps
            .AsNoTracking()
            .AsSplitQuery()
            .Select(r => new RoadmapDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                Subtitle = r.Subtitle,
                Color = r.Color,
                Icon = r.Icon,
                Tasks = r.RoadmapTasks.OrderBy(rt => rt.Id).Select(rt => new RoadmapTaskDto
                {
                    Id = rt.Id,
                    Icon = rt.Icon,
                    Locked = rt.Locked,
                    DesignTaskDto = rt.DesignTask == null ? null : new DesignTaskDto
                    {
                        Id = rt.DesignTask.Id,
                        Name = rt.DesignTask.Name,
                        Description = rt.DesignTask.Description,
                        Level = rt.DesignTask.Level,
                        ProgrammingLanguage = rt.DesignTask.ProgrammingLanguage,
                        Progresses = rt.DesignTask.Progresses
                            .Where(p => p.LearnerId == learnerId)
                            .Select(p => new ProgressDto
                            {
                                status = p.Status
                            })
                            .ToList()
                    }
                }).ToList()
            })
            .ToListAsync();


        return roadmaps;
    }


    public async Task<RoadmapDto?> GetRoadmapByIdWithProgressAsync(int id, Guid learnerId)
    {
        RoadmapDto? roadmap = await _context.Roadmaps
            .AsNoTracking()
            .AsSplitQuery()
            .Where(r => r.Id == id)
            .Select(r => new RoadmapDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                Subtitle = r.Subtitle,
                Color = r.Color,
                Icon = r.Icon,
                Tasks = r.RoadmapTasks.OrderBy(rt => rt.Id).Select(rt => new RoadmapTaskDto
                {
                    Id = rt.Id,
                    Icon = rt.Icon,
                    Locked = true,
                    DesignTaskDto = rt.DesignTask == null ? null : new DesignTaskDto
                    {
                        Id = rt.DesignTask.Id,
                        Name = rt.DesignTask.Name,
                        Description = rt.DesignTask.Description,
                        Level = rt.DesignTask.Level,
                        ProgrammingLanguage = rt.DesignTask.ProgrammingLanguage,
                        Progresses = rt.DesignTask.Progresses
                            .Where(p => p.LearnerId == learnerId)
                            .Select(p => new ProgressDto
                            {
                                status = p.Status
                            })
                            .ToList()
                    }
                }).ToList()
            }).FirstOrDefaultAsync();

        return roadmap;
    }
}

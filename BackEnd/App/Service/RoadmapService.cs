using App.Dto_s.RoadmapDto;
using App.Repository;
using Microsoft.Extensions.Logging;

namespace App.Service;

public class RoadmapService
{
    private readonly IRoadmapRepository _roadmapRepository;
    private readonly ILogger<RoadmapService> _logger;

    public RoadmapService(IRoadmapRepository roadmapRepository,
        ILogger<RoadmapService> logger)
    {
        _roadmapRepository = roadmapRepository;
        _logger = logger;
    }

    public async Task<List<RoadmapDto>> GetAllRoadmapsAsync()
    {
        List<RoadmapDto> roadmaps = await _roadmapRepository.GetAllRoadmapsAsync();
        if (roadmaps == null || !roadmaps.Any())
        {
            _logger.LogWarning("Roadmap not found.");
            return new List<RoadmapDto>();
        }
        foreach (var roadmap in roadmaps)
        {
            int minIdTask = roadmap.Tasks.Min(t => t.Id);
            bool UnLockNextTask = false;
            roadmap.Tasks.ForEach(t =>
            {
                if (t.DesignTaskDto != null && t.DesignTaskDto.Progresses != null)
                {
                    if (t.DesignTaskDto.Progresses.Any(p => p.status == true))
                    {
                        t.Locked = false;
                        UnLockNextTask = true;
                    }
                    else if (UnLockNextTask)
                    {
                        t.Locked = false;
                        UnLockNextTask = false;
                    }
                    else if (t.Id == minIdTask)
                        t.Locked = false;
                }
            });
        }
        return roadmaps;
    }

    public async Task<RoadmapDto?> GetRoadmapWithTasksByIdAsync(int id)
    {
        RoadmapDto? roadmap = await _roadmapRepository.GetRoadmapByIdAsync(id);
        if (roadmap is null)
        {
            _logger.LogWarning("Roadmap with ID {Id} not found.", id);
            return null;
        }
        int minIdTask = roadmap.Tasks.Min(t => t.Id);
        bool UnLockNextTask = false;
        roadmap.Tasks.ForEach(t =>
        {
            if (t.DesignTaskDto != null && t.DesignTaskDto.Progresses != null)
            {
                if (t.DesignTaskDto.Progresses.Any(p => p.status == true))
                {
                    t.Locked = false;
                    UnLockNextTask = true;
                }
                else if (UnLockNextTask)
                {
                    t.Locked = false;
                    UnLockNextTask = false;
                }
                else if (t.Id == minIdTask)
                    t.Locked = false;
            }
        });
        return roadmap;
    }
    public async Task<List<RoadmapDto>> GetAllRoadmapsWithProgressAsync(Guid learnerId)
    {
        List<RoadmapDto> roadmaps = await _roadmapRepository.GetAllRoadmapsWithProgressAsync(learnerId);
        if (roadmaps == null || !roadmaps.Any())
        {
            _logger.LogWarning("No roadmaps found for learner {LearnerId}.", learnerId);
            return new List<RoadmapDto>();
        }
        foreach (var roadmap in roadmaps)
        {
            int minIdTask = roadmap.Tasks.Min(t => t.Id);
            bool UnLockNextTask = false;
            roadmap.Tasks.ForEach(t =>
            {
                if (t.DesignTaskDto != null && t.DesignTaskDto.Progresses != null)
                {
                    if (t.DesignTaskDto.Progresses.Any(p => p.status == true))
                    {
                        t.Locked = false;
                        UnLockNextTask = true;
                    }
                    else if (UnLockNextTask)
                    {
                        t.Locked = false;
                        UnLockNextTask = false;
                    }
                    else if (t.Id == minIdTask)
                        t.Locked = false;
                }
            });
        }

        return roadmaps;
    }

    public async Task<RoadmapDto?> GetRoadmapWithProgressByIdAsync(int id, Guid learnerId)
    {
        RoadmapDto? roadmap = await _roadmapRepository.GetRoadmapByIdWithProgressAsync(id, learnerId);
        if (roadmap is null)
        {
            _logger.LogWarning("Roadmap with ID {Id} not found for learner {LearnerId}.", id, learnerId);
            return null;
        }
        int minIdTask = roadmap.Tasks.Min(t => t.Id);
        bool UnLockNextTask = false;
        roadmap.Tasks.ForEach(t =>
        {
            if (t.DesignTaskDto != null)
            {
                if (t.DesignTaskDto.Progresses.Any(p => p.status == true))
                {
                    t.Locked = false;
                    UnLockNextTask = true;
                }
                else if (UnLockNextTask)
                {
                    t.Locked = false;
                    UnLockNextTask = false;
                }
                else if (t.Id == minIdTask)
                    t.Locked = false;
            }
        });

        return roadmap;
    }
}

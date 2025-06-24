using App.Dto_s.RoadmapDto;

namespace App.Repository;

public interface IRoadmapRepository
{
    Task<RoadmapDto?> GetRoadmapByIdAsync(int id);
    Task<RoadmapDto?> GetRoadmapByIdWithProgressAsync(int id, Guid learnerId);
    Task<List<RoadmapDto>> GetAllRoadmapsAsync();
    Task<List<RoadmapDto>> GetAllRoadmapsWithProgressAsync(Guid learnerId);
}

using Domain.Entities;
using App.Dto_s.ProgressDtos;
using App.Dto_s.TaskDto;
namespace App.Dto_s.RoadmapDto;

public class RoadmapTaskDto
{
    public int Id { get; set; }
    public string Icon { get; set; } = null!;
    public bool Locked { get; set; }
    public DesignTaskDto? DesignTaskDto { get; set; }
}
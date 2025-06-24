namespace Domain.Entities;
public class RoadmapTask
{
    public int Id { get; set; }
    public bool Locked { get; set; }
    public string Icon { get; set; } = null!;
    public int RoadmapId { get; set; }
    public Roadmap Roadmap { get; set; } = null!;
    public Guid DesignTaskId { get; set; }
    public DesignTask DesignTask { get; set; } = null!;

}

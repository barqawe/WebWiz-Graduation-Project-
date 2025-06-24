namespace Domain.Entities;
public class Roadmap
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;
    public string Subtitle { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Color { get; set; } = null!;
    public string Icon { get; set; } = null!;

    public ICollection<RoadmapTask> RoadmapTasks { get; set; } = new List<RoadmapTask>();
    public ICollection<DesignTask> DesignTasks { get; set; } = new List<DesignTask>();
}

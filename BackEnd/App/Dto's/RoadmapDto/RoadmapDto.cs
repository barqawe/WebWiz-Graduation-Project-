namespace App.Dto_s.RoadmapDto;
public class RoadmapDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Subtitle { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Color { get; set; } = null!;
    public string Icon { get; set; } = null!;

    public List<RoadmapTaskDto> Tasks { get; set; } = new();
}

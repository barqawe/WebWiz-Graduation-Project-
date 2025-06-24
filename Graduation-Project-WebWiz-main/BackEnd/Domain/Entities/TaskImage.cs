namespace Domain.Entities;
public class TaskImage
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public Guid TaskId { get; set; }
    public DesignTask Task { get; set; } = null!;
}
using App.Dto_s.ProgressDtos;

namespace App.Dto_s.TaskDto;
public class DesignTaskDto
{
    public required Guid Id { get; set; }
    public string? Description { get; set; }
    public string? Name { get; set; }
    public string? Level { get; set; }
    public string? ProgrammingLanguage { get; set; }
    public List<ProgressDto> Progresses { get; set; }
}
namespace App.Dto_s.LearnerAuthDto;
public class LearnerResDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool CanCreateTask { get; set; } = false;
}

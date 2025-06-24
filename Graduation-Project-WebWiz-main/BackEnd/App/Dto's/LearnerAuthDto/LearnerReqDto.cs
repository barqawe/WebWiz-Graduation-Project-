namespace App.Dto_s.LearnerAuthDto;
public class LearnerReqDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool CanCreateTask { get; set; } = false;
    public string Password { get; set; } = string.Empty;
}
namespace App.Dto_s.LearnerAuthDto;

public class ExternalUserDto
{
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ProfileImage { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty; // "Google" or "GitHub"
    public string ProviderId { get; set; } = string.Empty; // Unique user ID from the provider
}

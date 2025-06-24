namespace Domain.Entities;
public class Learner
{
    public Guid Id { get; set; }
    public required string Username { get; set; }
    public string? PasswordHash { get; set; }
    public required string Email { get; set; }
    public required bool CanCreateTask { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public string? Provider { get; set; } // "Google", "GitHub", etc.
    public string? ProviderId { get; set; } // User ID from provider
    public string? ProfileImageUrl { get; set; } // Profile picture

    public int? TotalScore { get; set; }

    public int? CompletedTask { get; set; }

    // One-to-Many: A learner can create many tasks
    public ICollection<DesignTask>? CreatedTasks { get; set; }

    // Many-to-Many (via Progress): A learner can solve many tasks (Association Entity with Attributes)
    public ICollection<Progress> Progresses { get; set; } = new List<Progress>();

    public ICollection<RestCode> RestCodes { get; set; } = new List<RestCode>();

}
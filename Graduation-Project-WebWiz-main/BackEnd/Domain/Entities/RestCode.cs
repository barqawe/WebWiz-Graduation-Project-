namespace Domain.Entities;
public class RestCode
{
    public int Id { get; set; }
    public required int Code { get; set; }
    public DateTime ExpiryTime { get; set; } 
    public DateTime CreatedAt { get; set; }

    // Foreign key
    public Guid LearnerId { get; set; }

    // Navigation property
    public Learner Learner { get; set; } = null!;
}

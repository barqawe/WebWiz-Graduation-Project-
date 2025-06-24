
namespace Domain.Entities
{
    public class Progress
    {
        public Guid Id { get; set; }

        // Whether the task was successfully solved or not  
        public required bool Status { get; set; }

        public int? ScoreTask { get; set; }

        // Optional: when the solution was submitted
        //public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        // Foreign key to Learner (many-to-one)
        public Guid LearnerId { get; set; }
        public Learner Learner { get; set; }

        // Foreign key to DesignTask (many-to-one)
        public Guid DesignTaskId { get; set; }
        public DesignTask DesignTask { get; set; }
    }
}

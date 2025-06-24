namespace Domain.Entities
{
    public class OptimalTaskSolution
    {
        public Guid Id { get; set; }
        public string? HTML { get; set; } = string.Empty;
        public string? CSS { get; set; } = string.Empty;
        public string? JavaScript { get; set; } = string.Empty;
        public string? React { get; set; } = string.Empty;

        // One-to-One: A task solution is for one task
        public DesignTask Task { get; set; } = null!;

        public Guid TaskId { get; set; }
    }
}

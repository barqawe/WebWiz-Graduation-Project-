using System.Text.Json.Serialization;

namespace Domain.Entities
{
    public class DesignTask
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Level { get; set; }
        public required string ProgrammingLanguage { get; set; }

        // Replace single Design string with collection of TaskImages
        public List<TaskImage> Designs { get; set; } = new();

        // One-to-Many: A task is created by one learner
        public required Guid InstructorId { get; set; }
        public Learner Instructor { get; set; }

        // Many-to-Many (via Progress): A task can be solved by many learners
        public ICollection<Progress> Progresses { get; set; } = new List<Progress>();

        // One-to-One: A task can have one solution
        public OptimalTaskSolution? TaskSolution { get; set; }
        public int? RoadmapId { get; set; }       
        public Roadmap? Roadmap { get; set; }
        public ICollection<RoadmapTask> RoadmapTasks { get; set; } = new List<RoadmapTask>();


    }
}

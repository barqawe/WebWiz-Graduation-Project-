using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DataHandler
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Learner> Learners { get; set; }
        public DbSet<DesignTask> DesignTasks { get; set; }
        public DbSet<Progress> Progresses { get; set; }
        public DbSet<TaskImage> TaskImages { get; set; }
        public DbSet<OptimalTaskSolution> OptimalTaskSolutions { get; set; }
        public DbSet<RestCode> RestCodes { get; set; }
        public DbSet<Roadmap> Roadmaps { get; set; }
        public DbSet<RoadmapTask> RoadmapTasks { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);     
        }
    }
}
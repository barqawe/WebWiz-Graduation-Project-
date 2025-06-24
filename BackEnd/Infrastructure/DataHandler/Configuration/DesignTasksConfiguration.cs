using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DataHandler.Configuration
{
    public class DesignTasksConfiguration : IEntityTypeConfiguration<DesignTask>
    {
        public void Configure(EntityTypeBuilder<DesignTask> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Id)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

            
            builder.Property(t => t.Name)
                .HasColumnType("nvarchar(100)")
                .IsRequired();

            builder.Property(t => t.ProgrammingLanguage)
                .HasColumnType("nvarchar(255)")
                .IsRequired();

            builder.Property(t => t.Level)
                .HasColumnType("nvarchar(50)")
                .IsRequired(false);

            builder.Property(t => t.Description)
                .HasColumnType("nvarchar(max)")
                .IsRequired(false);

            // One-to-Many: Task -> Learner (Instructor)
            builder.HasOne(t => t.Instructor)
                .WithMany(l => l.CreatedTasks)
                .HasForeignKey(t => t.InstructorId)
                .OnDelete(DeleteBehavior.Cascade);
                
            builder.HasMany(t => t.Designs)
                .WithOne(di => di.Task)
                .HasForeignKey(di => di.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(dt=> dt.Roadmap)
                .WithMany(r => r.DesignTasks)
                .HasForeignKey(dt => dt.RoadmapId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.ToTable("DesignTasks");
        }
    }
}

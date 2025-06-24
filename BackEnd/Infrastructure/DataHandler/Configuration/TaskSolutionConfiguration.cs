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
    public class TaskSolutionConfiguration : IEntityTypeConfiguration<OptimalTaskSolution>
    {
        public void Configure(EntityTypeBuilder<OptimalTaskSolution> builder)
        {
            builder.HasKey(ts => ts.Id);

            builder.Property(ts => ts.Id)
                .HasColumnType("uniqueidentifier")
                .IsRequired();

            builder.Property(ts => ts.HTML)
                .HasColumnType("nvarchar(max)")
                .IsRequired(false);

            builder.Property(ts => ts.CSS)
                .HasColumnType("nvarchar(max)")
                .IsRequired(false);

            builder.Property(ts => ts.JavaScript)
                .HasColumnType("nvarchar(max)")
                .IsRequired(false);

            builder.Property(ts => ts.React)
                .HasColumnType("nvarchar(max)")
                .IsRequired(false);

            // One-to-One: TaskSolution -> DesignTask
            builder.HasOne(ts => ts.Task)
                .WithOne(t => t.TaskSolution)
                .HasForeignKey<OptimalTaskSolution>(ts => ts.TaskId)
                .OnDelete(DeleteBehavior.Restrict);


            builder.ToTable("OptimalTaskSolutions");
        }
    }
}

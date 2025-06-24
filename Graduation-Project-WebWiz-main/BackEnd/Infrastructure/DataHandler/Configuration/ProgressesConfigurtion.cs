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
    public class ProgressesConfigurtion : IEntityTypeConfiguration<Progress>
    {
        public void Configure(EntityTypeBuilder<Progress> builder)
        {
            builder.ToTable("Progress");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).HasColumnType("uniqueidentifier")
                .IsUnicode()
                .IsRequired();

            builder.Property(x => x.Status).HasColumnType("BIT")
                .IsRequired();


            builder.Property(x => x.ScoreTask)
                .HasColumnType("INT")
                .IsRequired();

            builder.Property(x => x.LearnerId).HasColumnType("uniqueidentifier");
            builder.Property(x => x.DesignTaskId).HasColumnType("uniqueidentifier");

            // One-to-Many: Progress -> Learner
            builder.HasOne(p => p.Learner)
                .WithMany(l => l.Progresses)
                .HasForeignKey(p => p.LearnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-Many: Progress -> DesignTask
            builder.HasOne(p => p.DesignTask)
                .WithMany(t => t.Progresses)
                .HasForeignKey(p => p.DesignTaskId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.ToTable("Progresses");
        }
    }
}

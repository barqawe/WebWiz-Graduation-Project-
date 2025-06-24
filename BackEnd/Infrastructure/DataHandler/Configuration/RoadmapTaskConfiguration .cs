using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.DataHandler.Configuration;
public class RoadmapTaskConfiguration : IEntityTypeConfiguration<RoadmapTask>
{
    public void Configure(EntityTypeBuilder<RoadmapTask> builder)
    {
        builder.HasKey(rt => rt.Id);

        builder.Property(rt => rt.Id)
            .HasColumnType("INT")
            .ValueGeneratedOnAdd();

        builder.Property(rt => rt.Locked)
            .HasColumnType("BIT")
            .IsRequired();

        builder.Property(rt => rt.Icon)
            .HasColumnType("nvarchar(50)")
            .IsRequired(false);

        builder.HasOne(rt => rt.Roadmap)
            .WithMany(r => r.RoadmapTasks)
            .HasForeignKey(rt => rt.RoadmapId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(rt => rt.DesignTask)
            .WithMany(dt => dt.RoadmapTasks)
            .HasForeignKey(rt => rt.DesignTaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.ToTable("RoadmapTasks");
    }
}

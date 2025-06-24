using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.DataHandler.Configuration;
public class RoadmapConfiguration : IEntityTypeConfiguration<Roadmap>
{
    public void Configure(EntityTypeBuilder<Roadmap> builder)
    {

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Id)
            .HasColumnType("int")
            .IsRequired()
            .ValueGeneratedNever();

        builder.Property(r => r.Title)
            .HasColumnType("nvarchar(255)")
            .IsRequired();

        builder.Property(r => r.Description)
            .HasColumnType("nvarchar(500)")
            .IsRequired(false);

        builder.Property(r => r.Color)
            .HasColumnType("nvarchar(50)")
            .IsRequired();

        builder.Property(r => r.Icon)
            .HasColumnType("nvarchar(50)")
            .IsRequired(false);


        builder.Property(r => r.Subtitle)
            .HasColumnType("nvarchar(255)")
            .IsRequired();

        builder.HasIndex(r => r.Title);

        builder.HasMany(r=> r.RoadmapTasks)
            .WithOne(rt => rt.Roadmap)
            .HasForeignKey(rt => rt.RoadmapId)
            .OnDelete(DeleteBehavior.Cascade);


        builder.ToTable("Roadmaps");
    }
}
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace Infrastructure.Persistence.Configurations
{
    public class TaskImageConfiguration : IEntityTypeConfiguration<TaskImage>
    {
        public void Configure(EntityTypeBuilder<TaskImage> builder)
        {
            builder.HasKey(ti => ti.Id);

            builder.Property(ti => ti.Id)
                .HasColumnType("int")
                .ValueGeneratedOnAdd();

            builder.Property(ti => ti.ImageUrl)
                .HasColumnType("nvarchar(1000)")
                .IsRequired();

            builder.Property(ti => ti.TaskId)
                .HasColumnType("uniqueidentifier")
                .IsRequired();

            builder.HasOne(ti => ti.Task)
                .WithMany(dt => dt.Designs)
                .HasForeignKey(ti => ti.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.ToTable("TaskImages");

        }
    }
}

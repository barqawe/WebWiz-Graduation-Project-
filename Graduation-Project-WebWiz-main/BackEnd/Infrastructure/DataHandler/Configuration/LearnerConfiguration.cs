using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.DataHandler.Configuration;

public class LearnerConfiguration : IEntityTypeConfiguration<Learner>
{
    public void Configure(EntityTypeBuilder<Learner> builder)
    {
        // Set primary key
        builder.HasKey(u => u.Id);

        // Configure properties with constraints
        builder.Property(x => x.Id)
           .HasColumnType("uniqueidentifier")
           .IsRequired()
           .ValueGeneratedNever();

        builder.Property(u => u.Username)
            .HasColumnType("nvarchar(255)")
            .IsRequired();

        builder.Property(u => u.PasswordHash)
            .HasColumnType("nvarchar(255)")
            .IsRequired(false);

        builder.Property(u => u.Email)
            .HasColumnType("nvarchar(255)")
            .IsRequired();

        builder.Property(u=>u.CanCreateTask)
            .HasColumnType("Bit")
            .IsRequired();

        builder.Property(u => u.RefreshToken)
            .HasColumnType("nvarchar(500)")
            .IsRequired(false);

        builder.Property(u => u.RefreshTokenExpiryTime)
            .HasColumnType("datetime2")
            .IsRequired(false);

        builder.Property(u => u.Provider)
            .HasColumnType("nvarchar(50)")
            .IsRequired(false);
        
        builder.Property(u => u.ProviderId)
            .HasColumnType("nvarchar(50)")
            .IsRequired(false);
        
        builder.Property(u => u.ProfileImageUrl)
            .HasColumnType("nvarchar(500)")
            .IsRequired(false);

        builder.Property(u => u.TotalScore)
            .HasColumnType("INT")
            .HasDefaultValue(0)
            .IsRequired(false);

        builder.Property(u => u.CompletedTask)
            .HasColumnType("INT")
            .HasDefaultValue(0)
            .IsRequired(false);
            

               

        builder.HasIndex(u => u.Email)
            .IsUnique();

        // One-to-Many: Learner -> DesignTasks (Created Tasks)
        builder.HasMany(l => l.CreatedTasks)
            .WithOne(t => t.Instructor)
            .HasForeignKey(t => t.InstructorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.ToTable("Learners");

    }
}

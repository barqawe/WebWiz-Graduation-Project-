using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace Infrastructure.Persistence.Configurations
{
    public class RestCodeConfiguration : IEntityTypeConfiguration<RestCode>
    {
        public void Configure(EntityTypeBuilder<RestCode> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(rc => rc.Id)
                .HasColumnType("int")
                .ValueGeneratedOnAdd() 
                .IsRequired();

            builder.Property(rc => rc.Code)
                .HasColumnType("int")
                .ValueGeneratedNever()
                .IsRequired();

            builder.Property(rc => rc.CreatedAt)
                .HasColumnType("datetime2")
                .ValueGeneratedNever()
                .IsRequired();

            builder.Property(rc => rc.ExpiryTime)
                .HasColumnType("datetime2")
                .ValueGeneratedNever()
                .IsRequired();

            builder.HasOne(rc => rc.Learner)
                .WithMany(l => l.RestCodes)
                .HasForeignKey(rc => rc.LearnerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.ToTable("RestCodes");

        }
    }
}

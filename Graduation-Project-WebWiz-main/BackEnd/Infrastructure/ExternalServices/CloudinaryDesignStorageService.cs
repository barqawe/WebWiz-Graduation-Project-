using App.Repository;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

public class CloudinaryDesignStorageService : IDesignStorageService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryDesignStorageService(IOptions<CloudinarySettings> options)
    {
        var settings = options.Value;

        var account = new Account(
            settings.CloudName,
            settings.ApiKey,
            settings.ApiSecret
        );

        _cloudinary = new Cloudinary(account);
        _cloudinary.Api.Secure = true;
    }
    public async Task<List<string>> UploadDesignsAsync(IFormFile[] designs)
    {
        var result = new List<string>();

        foreach (var design in designs)
        {
            if (!design.ContentType.StartsWith("image/")) continue;
            

            string fileExtension = Path.GetExtension(design.FileName);
            
            if (!IsAllowedFileExtension(fileExtension)) continue;

            using var stream = design.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription($"{Guid.NewGuid()}{fileExtension}", stream),
                Folder = "tasks",
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = false
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            result.Add(uploadResult.SecureUrl.ToString());
        }

        return result;
    }

    public Task<string> UploadImageAsync(IFormFile design)
    {
        if (!design.ContentType.StartsWith("image/"))
            throw new ArgumentException("File is not an image.");

        string fileExtension = Path.GetExtension(design.FileName);
        if (!IsAllowedFileExtension(fileExtension))
            throw new ArgumentException("File extension is not allowed.");

        using var stream = design.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription($"{Guid.NewGuid()}{fileExtension}", stream),
            Folder = "Profile",
            UseFilename = true,
            UniqueFilename = false,
            Overwrite = false
        };

        var uploadResult = _cloudinary.Upload(uploadParams);
        return Task.FromResult(uploadResult.SecureUrl.ToString());
    }

    private bool IsAllowedFileExtension(string extension)
    {
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".bmp" };
        return allowedExtensions.Contains(extension);
    }
}

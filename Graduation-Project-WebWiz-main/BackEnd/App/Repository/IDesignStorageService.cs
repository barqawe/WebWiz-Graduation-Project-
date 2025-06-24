using Microsoft.AspNetCore.Http;

namespace App.Repository;

public interface IDesignStorageService
{
    Task<List<string>> UploadDesignsAsync(IFormFile[] designs);
    Task<string> UploadImageAsync(IFormFile design);
}

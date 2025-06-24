using App.Dto_s.TaskDto;

namespace App.Repository
{
    public interface IExternalApiService
    {
        Task<string?> GetExternalDataAsync(AIEvaluationDtoReq req, Guid ID);

    }
}

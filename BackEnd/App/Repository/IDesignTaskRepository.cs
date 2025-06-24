using App.Dto_s;
using Domain.Entities;

namespace App.Repository
{
    public interface IDesignTaskRepository
    {
        int GetAllTasksCount();
        Task<DesignTask?> GetTaskByIdAsync(Guid id);
        Task<DesignTaskDtoRes?> CreateTaskAsync(DesignTaskDtoReq task, string userIdClaim, List<string> imagePaths);
        Task<DesignTask?> UpdateTaskAsync(Guid id, DesignTaskDtoReq task);
        Task<List<DesignTask>> GetFilteredTasksAsync(TaskFilterDto taskFilter);
        Task<List<DesignTaskDtoRes>> GetTasksByInstructorIdAsync(string userIdClaim);
        Task<bool> DeleteTaskAsync(Guid id);
    }
}

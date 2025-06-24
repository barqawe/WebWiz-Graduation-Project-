using App.Dto_s;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Repository
{
    public interface IProgressRepository
    {
        Task<ProgressDtoRes?> GetProgressByIDAsync(string userIdClaim);

        Task<Progress?> AddScoreTask(Guid ProgressId, int ScoreTask);
        Task<Progress?> GetProgressByUserAndTaskIdAsync(Guid userId, Guid taskId);
        Task<Progress?> UpdateProgressAsync(Progress progress);
        Task<Progress?> AddNewProgressAsync(Progress progress);
        Task<bool> GetStatusByLearnerIdAndTaskIdAsync(Guid learnerId, Guid taskId);
        Task<List<Progress>> GetProgressesByTaskId(Guid TaskId);
        Task DeleteProgressAsync(Guid LearnerId, Guid TaskId);
    }
}

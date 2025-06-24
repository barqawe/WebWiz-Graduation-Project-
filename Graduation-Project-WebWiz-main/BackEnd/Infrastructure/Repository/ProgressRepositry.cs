using App.Dto_s;
using App.Dto_s.TaskDto;
using App.Repository;
using Domain.Entities;
using Infrastructure.DataHandler;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repository
{
    public class ProgressRepositry : IProgressRepository
    {

        private readonly ILogger<ProgressRepositry> _logger;
        private readonly AppDbContext _context;


        public ProgressRepositry(ILogger<ProgressRepositry> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;

        }
        public async Task<ProgressDtoRes?> GetProgressByIDAsync(string userIdClaim)
        {
            try
            {
                Guid userId = Guid.Parse(userIdClaim);

                // Get all solved tasks for the learner (status == true)
                var solvedTasks = await _context.Progresses
                    .AsNoTracking()
                    .Where(p => p.LearnerId == userId && p.Status == true)
                    .Include(p => p.DesignTask)
                    .ToListAsync();

                if (!solvedTasks.Any())
                    return null;

                var learner = await _context.Learners
                    .AsNoTracking()
                    .FirstOrDefaultAsync(l => l.Id == userId);

                if (learner == null)
                    return null;

                var result = new ProgressDtoRes
                {
                    TotalPoint = learner.TotalScore,
                    CompletedTask = learner.CompletedTask,
                    DesignTasks = solvedTasks.Select(dt => new DesignTaskProgressDto
                    {
                        Name = dt.DesignTask.Name,
                        ProgrammingLanguage = dt.DesignTask.ProgrammingLanguage,
                        Level = dt.DesignTask.Level
                    }).ToList()
                };

                return result;
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error while creating task.");
                throw; // Bad request (400)
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Business logic error while creating task.");
                throw; // Conflict (409)
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized access attempt.");
                throw; // Forbidden (403)
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while creating task.");
                throw new Exception("An unexpected error occurred. Please try again later.");
            }
        }

        public async Task<Progress?> AddScoreTask(Guid ProgressId, int ScoreTask)
        {
            try
            {
                Progress? progress = await _context.Progresses
                        .FirstOrDefaultAsync(p => p.Id == ProgressId);

                if (progress is null)
                {
                    _logger.LogWarning("Progress object not found with ID: {ProgressId}", ProgressId);
                    return null;
                }

                progress.ScoreTask = (progress.ScoreTask) + ScoreTask;
                _context.Progresses.Update(progress);
                await _context.SaveChangesAsync();

                return progress;
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, "Error occurred while adding score to progress {ProgressId}", ProgressId);
                throw;
            }

        }

        public async Task<Progress?> GetProgressByUserAndTaskIdAsync(Guid userId, Guid taskId)
        {
            try
            {
                var progress = await _context.Progresses
                    .Include(p => p.Learner)
                    .Include(p => p.DesignTask)
                    .FirstOrDefaultAsync(p => p.LearnerId == userId && p.DesignTaskId == taskId);

                return progress;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving progress for user {UserId} and task {TaskId}", userId, taskId);
                throw;
            }
        }

        public async Task<Progress?> UpdateProgressAsync(Progress progress)
        {
            try
            {
                _context.Progresses.Update(progress);
                await _context.SaveChangesAsync();
                return progress;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating progress {ProgressId}", progress.Id);
                throw;
            }
        }

        public async Task<Progress?> AddNewProgressAsync(Progress progress)
        {
            try
            {
                _context.Progresses.Add(progress);
                await _context.SaveChangesAsync();
                return progress;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding new progress {ProgressId}", progress.Id);
                throw;
            }
        }

        public async Task<bool> GetStatusByLearnerIdAndTaskIdAsync(Guid learnerId, Guid taskId)
        {
            try
            {
                Progress? progress = await _context.Progresses
                    .FirstOrDefaultAsync(p => p.LearnerId == learnerId && p.DesignTaskId == taskId);

                if (progress != null)
                {
                    return progress.Status;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking status for learner {LearnerId} and task {TaskId}", learnerId, taskId);
                throw;
            }
        }

        public async Task<List<Progress>> GetProgressesByTaskId(Guid TaskId)
        {
            try
            {
                var progresses = await _context.Progresses
                    .Where(p => p.DesignTaskId == TaskId)
                    .Include(p => p.Learner)
                    .ToListAsync();
                return progresses;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all progresses for task {TaskId}", TaskId);
                throw;
            }
        }

        public async Task DeleteProgressAsync(Guid LearnerId, Guid TaskId)
        {
            try
            {
                var progress = await _context.Progresses
                    .FirstOrDefaultAsync(p => p.LearnerId == LearnerId && p.DesignTaskId == TaskId);

                if (progress != null)
                {
                    _context.Progresses.Remove(progress);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting progress for task {TaskId}", TaskId);
                throw;
            }
        }
    }
}

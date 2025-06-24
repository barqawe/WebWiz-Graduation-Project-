using App.Dto_s;
using App.Repository;
using Domain.Entities;
using Microsoft.Extensions.Logging;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using App.Dto_s.TaskDto;
using AutoMapper;
using System.Threading.Tasks;

namespace App.Service
{
    public class DesignTaskService
    {
        private readonly ILogger<DesignTaskService> _logger;
        private readonly IDesignTaskRepository _designTaskRepository;
        private readonly IExternalApiService _externalApiService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IMapper _mapper;
        private readonly IProgressRepository _progressRepository;
        private readonly IAuthRepository _authRepository;


        public DesignTaskService(
            ILogger<DesignTaskService> logger,
            IDesignTaskRepository designTaskRepository,
            IExternalApiService externalApiService,
            IWebHostEnvironment webHostEnvironment,
            IMapper mapper,
            IProgressRepository progressRepository,
            IAuthRepository authRepository)
        {
            _logger = logger;
            _designTaskRepository = designTaskRepository;
            _externalApiService = externalApiService;
            _webHostEnvironment = webHostEnvironment;
            _mapper = mapper;
            _progressRepository = progressRepository;
            _authRepository = authRepository;
        }

        public async Task<DesignTaskDtoRes?> CreateTaskAsync(DesignTaskDtoReq task, string userIdClaim, List<string> Urls)
        {
            if (task.Designs == null || task.Designs.Length == 0)
            {
                _logger.LogWarning("No design URLs were uploaded");
                throw new ArgumentException("At least one design URLs is required");
            }
            try
            {
                var newTask = await _designTaskRepository.CreateTaskAsync(task, userIdClaim, Urls);
                if (newTask is null)
                {
                    _logger.LogWarning("Task creation failed");
                    return null;
                }
                return newTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating task with file uploads");
                throw;
            }
        }
        public int GetAllTasksCountAsync()
        {
            int NumberOfTasks = _designTaskRepository.GetAllTasksCount();

            if (NumberOfTasks == 0)
            {
                _logger.LogWarning("No tasks found.");
                return 0;
            }

            return NumberOfTasks;
        }

        public async Task<DesignTaskDtoRes?> GetTaskByIdAsync(Guid id)
        {
            DesignTask? task = await _designTaskRepository.GetTaskByIdAsync(id);
            if (task is null)
            {
                _logger.LogWarning("Task not found: {TaskId}", id);
                return null;
            }
            DesignTaskDtoRes? Res = _mapper.Map<DesignTaskDtoRes>(task);
            return Res;
        }

        public async Task<DesignTask?> UpdateTaskAsync(Guid id, DesignTaskDtoReq task)
        {
            var updatedTask = await _designTaskRepository.UpdateTaskAsync(id, task);
            if (updatedTask is null)
            {
                _logger.LogWarning("Task not found: {TaskId}", id);
                return null;
            }
            return updatedTask;
        }

        public async Task<List<DesignTaskDtoRes>?> GetFilteredTasksAsync(TaskFilterDto taskFilter, string learnerId)
        {
            List<DesignTask> tasks = await _designTaskRepository.GetFilteredTasksAsync(taskFilter);
            List<DesignTaskDtoRes> filteredTasks = new List<DesignTaskDtoRes>();
            foreach (var task in tasks)
            {
                DesignTaskDtoRes taskDto = _mapper.Map<DesignTaskDtoRes>(task);
                if (learnerId != null)
                {
                    bool isCompleted = await _progressRepository.GetStatusByLearnerIdAndTaskIdAsync(Guid.Parse(learnerId), task.Id);
                    taskDto.Status = isCompleted;
                }
                filteredTasks.Add(taskDto);
            }
            if (filteredTasks is null || filteredTasks.Count == 0)
            {
                _logger.LogWarning("No tasks found with the given filter.");
                return null;
            }
            return filteredTasks;
        }

        public async Task<List<DesignTaskDtoRes>?> GetTasksByInstructorIdAsync(string userIdClaim)
        {
            List<DesignTaskDtoRes> tasksres = await _designTaskRepository.GetTasksByInstructorIdAsync(userIdClaim);
            if (tasksres is null || tasksres.Count == 0)
            {
                _logger.LogWarning("No tasks found for instructor ID: {InstructorId}", Guid.Parse(userIdClaim));
                return null;
            }
            return tasksres;
        }

        public async Task<string?> GetExternalEvaluationAsync(AIEvaluationDtoReq req, Guid ID)
        {
            string? externalEvaluation = await _externalApiService.GetExternalDataAsync(req, ID);

            if (externalEvaluation is null)
            {
                _logger.LogWarning("No evaluation returned.");
                return null;
            }
            return externalEvaluation;
        }

        public async Task<bool> CheckTaskCompletion(Guid userId, Guid TaskId, string TaskType, int totalScore)
        {
            try
            {
                _logger.LogInformation("Checking task completion for user {UserId} on task {TaskId} with score {Score}", userId, TaskId, totalScore);

                const int passingScore = 60;
                bool isTaskPassed = totalScore >= passingScore;

                var existingProgress = await _progressRepository.GetProgressByUserAndTaskIdAsync(userId, TaskId);

                if (existingProgress == null)
                {
                    _logger.LogInformation("First submission for user {UserId} on task {TaskId}", userId, TaskId);

                    var learner = await _authRepository.GetLearnerByIdAsync(userId);
                    var task = await _designTaskRepository.GetTaskByIdAsync(TaskId);

                    if (learner == null || task == null)
                    {
                        _logger.LogWarning("Could not find learner or task for progress creation. UserId: {UserId}, TaskId: {TaskId}", userId, TaskId);
                        throw new InvalidOperationException("Invalid user or task ID");
                    }

                    var newProgress = new Progress
                    {
                        Id = Guid.NewGuid(),
                        Status = isTaskPassed,
                        ScoreTask = totalScore,
                        LearnerId = userId,
                        DesignTaskId = TaskId,
                    };

                    await _progressRepository.AddNewProgressAsync(newProgress);

                    if (isTaskPassed)
                    {
                        await _authRepository.IncreaseTotalScore(userId, totalScore);
                        await _authRepository.IncreaseCompletedTask(userId);
                        _logger.LogInformation("Task passed on first attempt. Updated learner totals for user {UserId}", userId);
                    }
                }
                else
                {
                    int previousScore = existingProgress.ScoreTask ?? 0;
                    _logger.LogInformation("Repeat submission for user {UserId} on task {TaskId}. Previous score: {PreviousScore}, New score: {NewScore}",
                        userId, TaskId, previousScore, totalScore);

                    bool wasAlreadyPassed = existingProgress.Status;
                    bool shouldUpdateScore = totalScore > previousScore;

                    if (shouldUpdateScore)
                    {
                        int scoreDifference = 0;
                        if (previousScore > passingScore)
                            scoreDifference = totalScore - previousScore;
                        else
                            scoreDifference = totalScore;

                        existingProgress.ScoreTask = totalScore;
                        existingProgress.Status = isTaskPassed;
                        await _progressRepository.UpdateProgressAsync(existingProgress);

                        if (isTaskPassed)
                        {
                            await _authRepository.IncreaseTotalScore(userId, scoreDifference);

                            if (!wasAlreadyPassed)
                            {
                                await _authRepository.IncreaseCompletedTask(userId);
                                _logger.LogInformation("Task passed for the first time on repeat submission. Incremented completed task count for user {UserId}", userId);
                            }
                        }
                        else if (wasAlreadyPassed)
                        {
                            await _authRepository.IncreaseTotalScore(userId, scoreDifference);
                        }

                        _logger.LogInformation("Updated progress with higher score for user {UserId} on task {TaskId}", userId, TaskId);
                    }
                    else
                    {
                        _logger.LogInformation("New score is not higher than previous score. No updates made for user {UserId} on task {TaskId}", userId, TaskId);
                    }
                }

                _logger.LogInformation("Task completion check completed for user {UserId} on task {TaskId}. Passed: {IsTaskPassed}", userId, TaskId, isTaskPassed);
                return isTaskPassed;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking task completion for user {UserId} on task {TaskId}", userId, TaskId);
                throw;
            }
        }

        public async Task<bool> DeleteTaskAsync(Guid taskId, string userIdClaim)
        {
            try
            {
                DesignTask? task = await _designTaskRepository.GetTaskByIdAsync(taskId);
                if (task == null)
                {
                    _logger.LogWarning("Task with ID: {TaskId} not found", taskId);
                    return false;
                }

                if (task.InstructorId != Guid.Parse(userIdClaim))
                {
                    _logger.LogWarning("Unauthorized attempt to delete task with ID: {TaskId} by user: {UserId}", taskId, userIdClaim);
                    return false;
                }

                List<Progress> progresses = await _progressRepository.GetProgressesByTaskId(taskId);
                foreach (var progress in progresses)
                {
                    if (progress.ScoreTask >= 60)
                    {
                        await _authRepository.DecreaseTotalScore(progress.LearnerId, progress.ScoreTask ?? 0);
                    }
                    await _authRepository.DecreaseCompletedTask(progress.LearnerId);
                    await _progressRepository.DeleteProgressAsync(progress.LearnerId, taskId);
                }

                bool isDeleted = await _designTaskRepository.DeleteTaskAsync(taskId);
                if (!isDeleted)
                {
                    _logger.LogWarning("Failed to delete task with ID: {TaskId}", taskId);
                    return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting task with ID: {TaskId}", taskId);
                throw;
            }
        }

    }
}

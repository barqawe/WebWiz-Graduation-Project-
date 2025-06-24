using App.Dto_s;
using App.Repository;
using Domain.Entities;
using Infrastructure.DataHandler;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repository
{
    public class DesignTaskRepository : IDesignTaskRepository
    {
        private readonly AppDbContext _context;
        private readonly IAuthRepository _authRepository;
        private readonly ILogger<DesignTaskRepository> _logger;
        private static int NumberOftasks = 0;
        public DesignTaskRepository(AppDbContext context, ILogger<DesignTaskRepository> logger, IAuthRepository authRepository)
        {
            _context = context;
            _logger = logger;
            _authRepository = authRepository;
        }

        private DesignTaskDtoRes MapToDto(DesignTask designTask)
        {
            return new DesignTaskDtoRes
            {
                Id = designTask.Id,
                Name = designTask.Name,
                Level = designTask.Level ?? string.Empty,
                Programming_Language = designTask.ProgrammingLanguage,
                InstructorId = designTask.InstructorId,
            };
        }

        public async Task<DesignTaskDtoRes?> CreateTaskAsync(DesignTaskDtoReq task, string userIdClaim, List<string> imagePaths)
        {
            try
            {
                // 🛑 Validate that task name is not empty or whitespace
                if (string.IsNullOrWhiteSpace(task.Name))
                {
                    _logger.LogWarning("Task name cannot be empty.");
                    throw new ArgumentException("Task name is required.");
                }

                // ✅ Check if task already exists in the database
                if (await _context.DesignTasks.AnyAsync(t => t.Name == task.Name))
                {
                    _logger.LogWarning("Task already exists: {TaskName}", task.Name);
                    throw new InvalidOperationException("A task with this name already exists.");
                }

                // ✅ Check if the user ID is valid
                Guid userId = Guid.Parse(userIdClaim);
                Learner? currentUser = await _context.Learners
                    .FirstOrDefaultAsync(u => u.Id == userId);
                if (currentUser == null)
                {
                    _logger.LogWarning("User is not found.");
                    throw new UnauthorizedAccessException("User not found");
                }

                // ✅ Check if the user is an instructor
                if (currentUser.CanCreateTask == false)
                {
                    _logger.LogWarning("User {UserId} is not an instructor.", currentUser.Id);
                    throw new UnauthorizedAccessException("Only instructors can create tasks.");
                }

                // Create new task with ID
                var taskId = Guid.NewGuid();

                DesignTask designTask = new DesignTask
                {
                    Id = taskId,
                    Name = task.Name,
                    Description = task.Description,
                    Level = task.Level,
                    ProgrammingLanguage = task.Programming_Language,
                    InstructorId = currentUser.Id,
                    Instructor = currentUser,
                    Designs = new List<TaskImage>()
                };

                // Add image paths to the task
                foreach (var imagePath in imagePaths)
                {
                    designTask.Designs.Add(new TaskImage
                    {
                        ImageUrl = imagePath,
                        TaskId = taskId
                    });
                }

                _context.DesignTasks.Add(designTask);
                await _context.SaveChangesAsync();

                DesignTaskDtoRes result = MapToDto(designTask);
                _logger.LogInformation("Task created successfully: {TaskName}", task.Name);
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

        public int GetAllTasksCount()
        {
            return (NumberOftasks / 12) + 1;
        }

        public async Task<DesignTask?> GetTaskByIdAsync(Guid id)
        {
            try
            {
                var task = await _context.DesignTasks
                    .Include(t => t.Designs)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (task is null)
                {
                    _logger.LogWarning("Task not found: {TaskId}", id);
                    return null;
                }

                return task;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching task: {TaskId}", id);
                throw new Exception("An error occurred while retrieving the task. Please try again later.");
            }
        }

        public async Task<DesignTask?> UpdateTaskAsync(Guid id, DesignTaskDtoReq task)
        {
            try
            {
                var existingTask = await _context.DesignTasks
                    .Include(t => t.Designs)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (existingTask is null)
                {
                    _logger.LogWarning("Task not found: {TaskId}", id);
                    return null; // 404 Not Found
                }

                // 🛑 Validate that task name is not empty or whitespace
                if (string.IsNullOrWhiteSpace(task.Name))
                {
                    _logger.LogWarning("Task name cannot be empty.");
                    throw new ArgumentException("Task name is required."); // 400 Bad Request
                }

                // ✅ Ensure the new task name is not already in use (excluding the same task)
                if (await _context.DesignTasks.AnyAsync(t => t.Name == task.Name && t.Id != id))
                {
                    _logger.LogWarning("Task already exists: {TaskName}", task.Name);
                    throw new InvalidOperationException("A task with this name already exists."); // 400 Bad Request
                }

                // ✅ Update the necessary fields
                existingTask.Name = task.Name;
                existingTask.Description = task.Description;
                existingTask.Level = task.Level;
                existingTask.ProgrammingLanguage = task.Programming_Language;

                await _context.SaveChangesAsync(); // ✅ Save changes without Update()

                _logger.LogInformation("Task updated successfully: {TaskId}", id);
                return existingTask;
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex.Message);
                throw; // 400 Bad Request
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex.Message);
                throw; // 400 Bad Request
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating task: {TaskId}", id);
                throw new Exception("An error occurred while updating the task. Please try again later."); // 500 Internal Server Error
            }
        }

        public async Task<List<DesignTask>> GetFilteredTasksAsync(TaskFilterDto taskFilter)
        {
            IQueryable<DesignTask> query = _context.DesignTasks
                .Include(t => t.Designs)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(taskFilter.Programming_Language))
                query = query.Where(t => t.ProgrammingLanguage == taskFilter.Programming_Language);

            if (!string.IsNullOrWhiteSpace(taskFilter.Level))
                query = query.Where(t => t.Level == taskFilter.Level);

            query = query.Where(t => t.RoadmapId == null);

            NumberOftasks = query.Count();

            // Pagination 
            int skip = (taskFilter.PageNumber - 1) * taskFilter.PageSize;
            var tasks = await query
                .Skip(skip)
                .Take(taskFilter.PageSize)
                .ToListAsync();

            return tasks.ToList();
        }

        public async Task<List<DesignTaskDtoRes>> GetTasksByInstructorIdAsync(string userIdClaim)
        {
            try
            {
                // Check if the user ID is valid
                Guid userId = Guid.Parse(userIdClaim);
                Learner? currentUser = await _context.Learners
                    .FirstOrDefaultAsync(u => u.Id == userId);
                if (currentUser == null)
                {
                    _logger.LogWarning("User is not found.");
                    throw new UnauthorizedAccessException("User not found");
                }

                // Check if the user is an instructor
                if (currentUser.CanCreateTask == false)
                {
                    _logger.LogWarning("User {UserId} is not an instructor.", currentUser.Id);
                    return new List<DesignTaskDtoRes>();
                }

                var instructorTasks = await _context.DesignTasks
                    .Where(t => t.InstructorId == userId)
                    .ToListAsync();

                return instructorTasks.Select(MapToDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching tasks by instructor ID.");
                throw new Exception("An error occurred while retrieving tasks by instructor ID. Please try again later.");
            }
        }

        public async Task<bool> DeleteTaskAsync(Guid id)
        {
            try
            {
                var task = await _context.DesignTasks
                    .Include(t => t.Designs)
                    .Include(ts => ts.TaskSolution)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (task is null)
                {
                    _logger.LogWarning("Task not found: {TaskId}", id);
                    throw new KeyNotFoundException("Task not found.");
                }

                _context.TaskImages.RemoveRange(task.Designs);
                _logger.LogInformation("Designs removed for task: {TaskId}", id);
                if (task.TaskSolution != null)
                {
                    _context.OptimalTaskSolutions.Remove(task.TaskSolution);
                    _logger.LogInformation("Task solution removed for task: {TaskId}", id);
                }
                _context.DesignTasks.Remove(task);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Task deleted successfully: {TaskId}", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting task: {TaskId}", id);
                throw new Exception("An error occurred while deleting the task. Please try again later.");
            }
        }
    }
}
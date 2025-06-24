using App.Dto_s;
using App.Dto_s.TaskDto;
using App.Service;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;
namespace WhateverEnd.Controllers
{
    [Route("api/Design-Task")]
    [ApiController]
    public class DesignTaskController : ControllerBase
    {
        private readonly DesignTaskService _designTaskService;
        private readonly OptimalTaskSolutionService _optimalTaskSolutionService;
        private readonly ILogger<DesignTaskController> _logger;
        private readonly CloudinaryDesignStorageService _designStorageService;

        public DesignTaskController(DesignTaskService designTaskService,
            OptimalTaskSolutionService optimalTaskSolutionService, ILogger<DesignTaskController> logger,
            CloudinaryDesignStorageService designStorageService
            )
        {
            _designTaskService = designTaskService;
            _optimalTaskSolutionService = optimalTaskSolutionService;
            _logger = logger;
            _designStorageService = designStorageService;
        }

        [HttpPost]
        [Route("CreateTask")]
        public async Task<ActionResult<DesignTaskDtoRes>> CreateTaskAsync([FromForm] DesignTaskDtoReq task)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state: {Errors}",
                        string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
                    return BadRequest(ModelState);
                }

                _logger.LogInformation("Received {Count} files for task {Name}", task.Designs.Length, task.Name);

                string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    _logger.LogWarning("User is not authenticated");
                    return Unauthorized("User is not authenticated.");
                }

                List<string> Urls = await _designStorageService.UploadDesignsAsync(task.Designs);


                DesignTaskDtoRes? createdTask = await _designTaskService.CreateTaskAsync(task, userIdClaim, Urls);
                if (createdTask is null)
                {
                    _logger.LogError("Failed to create task");
                    return StatusCode(500, "An error occurred while creating task.");
                }

                _logger.LogInformation("Task created successfully: {TaskId}", createdTask.Id);
                OptimalTaskSolutionDto optimalTaskSolutionDto = new OptimalTaskSolutionDto
                {
                    HTML = task.HTML,
                    CSS = task.CSS,
                    JS = task.JS,
                    React = task.React,
                };

                OptimalTaskSolutionDto? optimalTaskSolution = await _optimalTaskSolutionService.AddOptimalTaskSolutionAsync(optimalTaskSolutionDto, createdTask.Id);
                if (optimalTaskSolution is null)
                {
                    _logger.LogError("Failed to add optimal task solution");
                    return StatusCode(500, "An error occurred while adding optimal task solution.");
                }

                return Ok(createdTask);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Argument error: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid operation: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized: {Message}", ex.Message);
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating task");
                return StatusCode(500, "An error occurred while creating task: " + ex.Message);
            }
        }

        [HttpGet]
        [Route("GetAllTasksCount")]
        public ActionResult<List<DesignTask>> GetAllTasksCount()
        {
            try
            {
                int NumberOfTasks = _designTaskService.GetAllTasksCountAsync();
                if (NumberOfTasks == 0)
                    return NotFound("No tasks found.");
                return Ok(NumberOfTasks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching tasks");
                return StatusCode(500, "An error occurred while fetching tasks.");
            }
        }

        [HttpGet]
        [Route("GetTaskById/{id}")]
        public async Task<ActionResult<DesignTask>> GetTaskByIdAsync(Guid id)
        {
            try
            {
                var task = await _designTaskService.GetTaskByIdAsync(id);
                if (task is null)
                    return NotFound("Task not found.");
                return Ok(task);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching task {TaskId}", id);
                return StatusCode(500, "An error occurred while fetching task.");
            }
        }

        [HttpPut]
        [Route("UpdateTask/{id}")]
        public async Task<ActionResult<DesignTask>> UpdateTaskAsync(Guid id, [FromBody] DesignTaskDtoReq task)
        {
            try
            {
                var updatedTask = await _designTaskService.UpdateTaskAsync(id, task);
                if (updatedTask is null)
                    return NotFound("Task not found.");
                return Ok(updatedTask);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument when updating task {TaskId}", id);
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid operation when updating task {TaskId}", id);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating task {TaskId}", id);
                return StatusCode(500, "An error occurred while updating the task. Please try again later."); // 500 Internal Server Error
            }
        }

        [HttpPost]
        [Route("GetFilteredTasks")]
        public async Task<ActionResult<List<DesignTaskDtoRes>>> GetFilteredTasksAsync([FromBody] TaskFilterDto taskFilter)
        {
            var learnerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            try
            {
                List<DesignTaskDtoRes>? tasks = await _designTaskService.GetFilteredTasksAsync(taskFilter, learnerId);

                if (tasks == null || tasks.Count == 0)
                {
                    return NotFound("No tasks found with the given filters.");
                }

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting filtered tasks");
                return StatusCode(500, "An error occurred while fetching filtered tasks.");
            }
        }

        [Authorize]
        [HttpGet]
        [Route("GetTasksByInstructorId")]
        public async Task<ActionResult<List<DesignTaskDtoRes>>> GetTasksByInstructorIdAsync()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized("User is not authenticated.");
                }
                var tasks = await _designTaskService.GetTasksByInstructorIdAsync(userIdClaim);
                if (tasks is null || tasks.Count == 0)
                    return NotFound("No tasks found for the given instructor ID.");
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tasks by instructor ID");
                return StatusCode(500, "An error occurred while fetching tasks by instructor ID.");
            }
        }

        [HttpPost]
        [Route("GetExternalEvaluationAsync")]
        public async Task<IActionResult> GetExternalEvaluationAsync([FromForm] AIEvaluationDtoReq req)
        {
            string? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                _logger.LogWarning("User is not authenticated");
                return Unauthorized("User is not authenticated.");
            }
            Guid.TryParse(userIdClaim, out var userId);

            if (string.IsNullOrWhiteSpace(req.HTML) && string.IsNullOrWhiteSpace(req.JSX))
            {
                _logger.LogWarning("HTML or REACT code is required At least.");
                return BadRequest("HTML or REACT code is required At least.");
            }
            else if (!string.IsNullOrWhiteSpace(req.HTML) && !string.IsNullOrWhiteSpace(req.JSX))
            {
                _logger.LogWarning("HTML and REACT code are not allowed together.");
                return BadRequest("HTML and REACT code are not allowed together.");
            }
            else if (!string.IsNullOrWhiteSpace(req.JS) && !string.IsNullOrWhiteSpace(req.JSX))
            {
                _logger.LogWarning("JS and REACT code are not allowed together.");
                return BadRequest("JS and REACT code are not allowed together.");
            }

            string? result = await _designTaskService.GetExternalEvaluationAsync(req, req.Id);

            if (result is null)
            {
                _logger.LogWarning("No external evaluation data found.");
                return NotFound("No external evaluation data found.");
            }


            using JsonDocument innerDoc = JsonDocument.Parse(result);
            if (innerDoc.RootElement.TryGetProperty("totalScore", out JsonElement totalScoreElement) &&
                innerDoc.RootElement.TryGetProperty("type", out JsonElement typeElement))
            {
                int totalScore = totalScoreElement.GetInt32();
                string TaskType = typeElement.GetString()!;

                await _designTaskService.CheckTaskCompletion(userId, req.Id, TaskType, totalScore);

            }
            else
            {
                _logger.LogWarning("Expected properties are missing in the result JSON.");
                return BadRequest("Invalid response format from external evaluation.");
            }




            return Ok(result);
        }
        [Authorize]
        [HttpDelete]
        [Route("DeleteTask")]
        public async Task<IActionResult> DeleteTaskByIdAsync([FromQuery] Guid id)
        {
            try
            {
                var UserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(UserIdClaim))
                {
                    _logger.LogWarning("Learner ID not found in token");
                    return Unauthorized("Learner ID not found.");
                }
                bool isDeleted = await _designTaskService.DeleteTaskAsync(id, UserIdClaim);
                if (!isDeleted)
                {
                    _logger.LogWarning("Task with ID {TaskId} not found for deletion", id);
                    return NotFound("Task not found.");
                }
                return Ok("Task deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting task {TaskId}", id);
                return StatusCode(500, "An error occurred while deleting the task.");
            }
        }
    }
}

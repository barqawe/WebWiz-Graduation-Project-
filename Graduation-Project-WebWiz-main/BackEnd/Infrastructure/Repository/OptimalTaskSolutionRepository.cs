using App.Repository;
using Domain.Entities;
using Infrastructure.DataHandler;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repository
{
    public class OptimalTaskSolutionRepository : IOptimalTaskSolutionRepository
    {

        private readonly AppDbContext _context;
        private readonly ILogger<DesignTaskRepository> _logger;

        public OptimalTaskSolutionRepository(AppDbContext context, ILogger<DesignTaskRepository> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<OptimalTaskSolution?> AddOptimalTaskSolutionAsync(OptimalTaskSolution optimalTaskSolutio)
        {
            try
            {
                // Add the task to the context
                await _context.OptimalTaskSolutions.AddAsync(optimalTaskSolutio);
                
                // Save changes to the database
                await _context.SaveChangesAsync();

                _logger.LogInformation("Optimal task solution added successfully with ID: {Id} and Task ID: {Id}", optimalTaskSolutio.Id, optimalTaskSolutio.TaskId);

                return optimalTaskSolutio;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding optimal task solution");
                return null;
            }
        }

        public async Task<OptimalTaskSolution?> GetOptimalTaskSolutionByTaskIdAsync(Guid TaskId)
        {
            try
            {
                // Retrieve the optimal task solution by TaskId
                OptimalTaskSolution? optimalTaskSolution = await _context.OptimalTaskSolutions
                    .FirstOrDefaultAsync(x => x.TaskId == TaskId);
                if (optimalTaskSolution is null)
                {
                    _logger.LogWarning("Optimal task solution not found for TaskId: {TaskId}", TaskId);
                }
                else
                {
                    _logger.LogInformation("Optimal task solution retrieved successfully for TaskId: {TaskId}", TaskId);
                }
                return optimalTaskSolution;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving optimal task solution for TaskId: {TaskId}", TaskId);
                return null;
            }
        }
    }
}

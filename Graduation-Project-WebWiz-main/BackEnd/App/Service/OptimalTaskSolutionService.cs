using App.Dto_s.TaskDto;
using App.Repository;
using AutoMapper;
using Domain.Entities;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Service
{
    public class OptimalTaskSolutionService
    {

        private readonly ILogger<DesignTaskService> _logger;
        private readonly IOptimalTaskSolutionRepository _optimalTaskSolutionRepository;
        private readonly IMapper _mapper;

        public OptimalTaskSolutionService(
            ILogger<DesignTaskService> logger,
            IOptimalTaskSolutionRepository optimalTaskSolutionRepository,
            IMapper mapper)
        {
            _logger = logger;
            _optimalTaskSolutionRepository = optimalTaskSolutionRepository;
            _mapper = mapper;
        }

        public async Task<OptimalTaskSolutionDto?> AddOptimalTaskSolutionAsync(OptimalTaskSolutionDto optimalTaskSolutionDtoReq, Guid TaskId)
        {
            try
            {
                // Validate the input DTO
                if (optimalTaskSolutionDtoReq == null)
                {
                    _logger.LogWarning("Optimal task solution DTO is null");
                    throw new ArgumentNullException(nameof(optimalTaskSolutionDtoReq), "Optimal task solution DTO cannot be null");
                }

                // Validate TaskId
                if (TaskId == Guid.Empty)
                {
                    _logger.LogWarning("Invalid TaskId: {TaskId}", TaskId);
                    throw new ArgumentException("TaskId cannot be empty", nameof(TaskId));
                }

                // Map DTO to entity
                OptimalTaskSolution optimalTaskSolution = _mapper.Map<OptimalTaskSolution>(optimalTaskSolutionDtoReq);
                optimalTaskSolution.TaskId = TaskId;

                // Add the task to the context
                OptimalTaskSolution? result = await _optimalTaskSolutionRepository.AddOptimalTaskSolutionAsync(optimalTaskSolution);
                
                // Check if the result is null
                if (result is null)
                {
                    _logger.LogError("Failed to add optimal task solution");
                    return null;
                }

                // Map entity back to DTO
                OptimalTaskSolutionDto optimalTaskSolutionDtoRes = _mapper.Map<OptimalTaskSolutionDto>(result);
                return optimalTaskSolutionDtoRes;
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "Optimal task solution DTO is null");
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding optimal task solution");
                return null;
            }
        }
    }
}

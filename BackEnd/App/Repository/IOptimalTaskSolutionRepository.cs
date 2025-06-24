using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Repository
{
    public interface IOptimalTaskSolutionRepository
    {
        Task<OptimalTaskSolution?> AddOptimalTaskSolutionAsync(OptimalTaskSolution task);
        Task<OptimalTaskSolution?> GetOptimalTaskSolutionByTaskIdAsync(Guid TaskId);
    }
}
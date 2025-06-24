using App.Dto_s;
using App.Repository;
using Domain.Entities;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Service
{
    public sealed class ProgressService
    {
        private readonly ILogger<ProgressService> _logger;
        private readonly IProgressRepository _ProgresRepository;
        public ProgressService(ILogger<ProgressService> logger, IProgressRepository ProgresRepository)
        {
            _logger = logger;

            _ProgresRepository = ProgresRepository;
        }
        public async Task<ProgressDtoRes?> GetProgresByIDAsync(string userIdClaim)
        {
            // Retrieve the progress entries for the given user ID
            var Progress = await _ProgresRepository.GetProgressByIDAsync(userIdClaim);

            // If no progress entries are found, log a warning and return null
            if (Progress is null)
            {
                _logger.LogWarning("Progres failed");
                return null!;
            }
            // Return the list of progress entries for the user
            return Progress;
        }
    }
}

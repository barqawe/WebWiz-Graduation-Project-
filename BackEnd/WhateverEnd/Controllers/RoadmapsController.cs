using App.Service;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;


[ApiController]
[Route("api/[controller]")]
public class RoadmapsController : ControllerBase
{
    private readonly RoadmapService _roadmapService;

    public RoadmapsController(RoadmapService roadmapService)
    {
        _roadmapService = roadmapService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllRoadmaps()
    {
        var roadmaps = await _roadmapService.GetAllRoadmapsAsync();
        return Ok(roadmaps);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRoadmap(int id)
    {
        var result = await _roadmapService.GetRoadmapWithTasksByIdAsync(id);
        if (result is null)
            return NotFound(new { message = "Roadmap not found." });

        return Ok(result);
    }

    [HttpGet("progress/{learnerId}")]
    public async Task<IActionResult> GetAllRoadmapsWithProgress(Guid learnerId)
    {
        var roadmaps = await _roadmapService.GetAllRoadmapsWithProgressAsync(learnerId);
        return Ok(roadmaps);
    }

    [HttpGet("{id}/progress/{learnerId}")]
    public async Task<IActionResult> GetRoadmapWithProgressAlternative(int id, Guid learnerId)
    {
        var result = await _roadmapService.GetRoadmapWithProgressByIdAsync(id, learnerId);
        if (result is null)
            return NotFound(new { message = "Roadmap not found or no progress data available for this learner." });

        return Ok(result);
    }
}

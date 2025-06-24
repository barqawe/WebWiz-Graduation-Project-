using App.Dto_s;
using App.Service;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WhateverEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgressController(ProgressService progresService) : ControllerBase
    {
        [Authorize]
        [HttpGet("Progress")]
        public async Task<ActionResult<Progress>> GetProgressById()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User is not Authorized");
            }
            var progress = await progresService.GetProgresByIDAsync(userIdClaim);

            if (progress is null)
                return BadRequest("no progress for this user");

            return Ok(progress);
        }
    }
}
